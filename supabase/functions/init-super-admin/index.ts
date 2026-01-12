// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// @ts-ignore - Deno runtime imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno runtime imports
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    // @ts-ignore - Deno global
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    // @ts-ignore - Deno global
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    // @ts-ignore - Deno global
    const superAdminEmail = Deno.env.get("SUPER_ADMIN_EMAIL");
    // @ts-ignore - Deno global
    const superAdminPassword = Deno.env.get("SUPER_ADMIN_PASSWORD");
    // @ts-ignore - Deno global
    const superAdminName = Deno.env.get("SUPER_ADMIN_NAME") || "Super Admin";

    // Validate required environment variables
    if (!superAdminEmail || !superAdminPassword) {
      return new Response(
        JSON.stringify({
          error: "Missing required environment variables: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if super admin already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("user_id, is_super_admin")
      .eq("is_super_admin", true)
      .maybeSingle();

    if (existingProfile) {
      return new Response(
        JSON.stringify({
          message: "Super admin already exists",
          user_id: existingProfile.user_id,
          warning: "This function can only be executed once for security reasons",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user with this email already exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(
      superAdminEmail
    );

    let userId: string;

    if (existingUser?.user) {
      // User exists, update their profile
      userId = existingUser.user.id;

      // Update profile to super admin
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          is_super_admin: true,
          is_admin: true,
          full_name: superAdminName,
        })
        .eq("user_id", userId);

      if (profileError) {
        throw profileError;
      }

      // Update password if needed
      if (superAdminPassword) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          userId,
          { password: superAdminPassword }
        );

        if (passwordError) {
          console.error("Error updating password:", passwordError);
          // Don't throw, password update is optional if user already exists
        }
      }
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: superAdminEmail,
        password: superAdminPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: superAdminName,
        },
      });

      if (createError) {
        throw createError;
      }

      if (!newUser.user) {
        throw new Error("Failed to create user");
      }

      userId = newUser.user.id;

      // Update profile to super admin
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          is_super_admin: true,
          is_admin: true,
          full_name: superAdminName,
        })
        .eq("user_id", userId);

      if (profileError) {
        throw profileError;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Super admin initialized successfully",
        user_id: userId,
        email: superAdminEmail,
        note: "You can now log in with these credentials",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error initializing super admin:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to initialize super admin",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
