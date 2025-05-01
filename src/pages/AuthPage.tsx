import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { signIn, signUp } from '@/services/auth';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para formulário de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para formulário de cadastro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [userRole, setUserRole] = useState<'client' | 'professional'>('client');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!loginEmail || !loginPassword) {
        throw new Error('Por favor, preencha todos os campos');
      }

      await signIn(loginEmail, loginPassword);
      
      toast({
        title: "Login realizado com sucesso!",
      });
      navigate('/profile');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao fazer login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validação básica
      if (!name || !email || !phone || !password || !location) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }
      
      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      const userData = {
        name,
        email,
        phone,
        location,
        role: userRole
      };
      
      await signUp(userData, password);
      
      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo(a) ao Cuide-Se, ${name}!`,
      });
      navigate('/profile');
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao criar sua conta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Acesse sua conta
            </h1>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastre-se</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Acesse sua conta para gerenciar seus agendamentos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input 
                          id="login-email" 
                          type="email"
                          placeholder="seu@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Senha</Label>
                        <Input 
                          id="login-password" 
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-pink hover:bg-pink/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Entrando..." : "Entrar"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar conta</CardTitle>
                    <CardDescription>
                      Junte-se à comunidade Cuide-Se e comece a agendar serviços.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                      <RadioGroup 
                        defaultValue={userRole}
                        className="flex justify-center space-x-6 mb-4"
                        onValueChange={(value) => setUserRole(value as 'client' | 'professional')}
                        disabled={isLoading}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="client" id="client" />
                          <Label htmlFor="client">Cliente</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="professional" id="professional" />
                          <Label htmlFor="professional">Profissional</Label>
                        </div>
                      </RadioGroup>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input 
                          id="name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                          id="phone" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Cidade/Estado</Label>
                        <Input 
                          id="location" 
                          placeholder="São Paulo, SP"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Senha</Label>
                          <Input 
                            id="password" 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar senha</Label>
                          <Input 
                            id="confirm-password" 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      
                      {userRole === 'professional' && (
                        <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                          Como profissional, você precisará completar seu perfil com informações adicionais após o cadastro.
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-pink hover:bg-pink/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Criando conta..." : "Criar conta"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
