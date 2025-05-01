
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Home } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock admin credentials - in a real app, this would be authenticated against a secure backend
  const ADMIN_USER = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple mock authentication
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
        // Set admin authentication in localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminLastLogin', new Date().toISOString());
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao painel administrativo do Cuide-Se.",
        });
        
        navigate('/admin/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Falha no login",
          description: "Credenciais inválidas. Tente novamente.",
        });
      }
      setLoading(false);
    }, 800); // Simulate network request
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Home button */}
      <div className="bg-white p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-pink">Cuide-Se Admin</h1>
          <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
            <Home size={16} />
            Voltar ao site
          </Button>
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-pink">Área Administrativa</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input 
                  id="username" 
                  placeholder="Digite seu nome de usuário (admin)" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Digite sua senha (admin123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                <strong>Credenciais de acesso:</strong><br/>
                Usuário: admin<br/>
                Senha: admin123
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-pink hover:bg-pink/90"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
