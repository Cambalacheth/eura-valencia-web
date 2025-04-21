
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log("Received form data:", formData);

    // Configuración de correo - enviamos a ambas direcciones de correo
    const recipientEmail = "lautaro.sarni@gmail.com";
    const resendRegisteredEmail = "cambalach.eth@gmail.com"; // La dirección con la que te registraste en Resend
    
    // Enviamos una copia al correo registrado en Resend (esto funcionará en modo prueba)
    const emailResponse = await resend.emails.send({
      from: "Eura Proyectos <onboarding@resend.dev>",
      to: [resendRegisteredEmail],
      subject: `Nuevo proyecto de ${formData.fullName} - COPIA`,
      html: `
        <h1>Nuevo proyecto</h1>
        <p><strong>Nombre:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Teléfono:</strong> ${formData.phone}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${formData.message}</p>
        <p><strong>IMPORTANTE:</strong> Este es un correo de copia enviado a tu cuenta registrada en Resend. Para recibir correos en lautaro.sarni@gmail.com, necesitas verificar un dominio en Resend.</p>
      `,
    });

    console.log("Email sent successfully to Resend registered email:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
