
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Phone, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Introduce un correo electrónico válido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Sending form data:", values);
      
      // Map form field names to match the database column names
      const dbValues = {
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        message: values.message,
      };
      
      // Insert the message into Supabase
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([dbValues]);

      if (dbError) {
        console.error("Error submitting to Supabase:", dbError);
        throw new Error(dbError.message);
      }

      console.log("Message saved to database successfully");

      // Try to send email notification via edge function
      try {
        const response = await fetch("https://pmczckzukrwrgmjkeahv.functions.supabase.co/send-email", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtY3pja3p1a3J3cmdtamtlYWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDIxMTEsImV4cCI6MjA2MDU3ODExMX0.Cz8ZwU-ECkJUmQw0gKNghvqd5RGp_-8AmmzpsRF2yGs`
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Email API responded with error:", errorData);
          console.log("However, message was saved to database");
        } else {
          console.log("Email sent successfully");
        }
      } catch (emailError) {
        console.error("Email sending error (but form was saved):", emailError);
        // Continue with success message since the database entry was successful
      }

      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Nos pondremos en contacto contigo pronto.",
      });
      
      form.reset();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} placeholder="Tu nombre" className="pl-10" />
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} placeholder="tucorreo@email.com" className="pl-10" />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} placeholder="+34 000 000 000" className="pl-10" />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¡Cuéntanos tu proyecto!</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe tu proyecto..." className="min-h-[150px] resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" /> 
          {isSubmitting ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
