
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [email, setEmail] = useState('AdminEura');
  const [password, setPassword] = useState('EuraAdmin');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_admin: true
          }
        }
      });

      if (error) throw error;

      // Insert admin user record
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({ 
          id: data.user?.id, 
          email, 
          is_admin: true 
        });

      if (adminError) throw adminError;

      toast({
        title: "Admin User Created",
        description: "Admin user registered successfully",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-light mb-8">Admin Registration</h1>
        
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                readOnly
              />
            </div>
            <Button type="submit" className="w-full">
              Create Admin User
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
