
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Phone, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Introduce un correo electrónico válido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

const ContactForm = () => {
  const { toast } = useToast();
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
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Error al enviar el mensaje");

      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, inténtalo de nuevo.",
      });
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

        <Button type="submit" className="w-full" size="lg">
          <Send className="mr-2 h-4 w-4" /> Enviar mensaje
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
