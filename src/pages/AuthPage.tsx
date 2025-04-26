
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para formulário de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Estado para formulário de cadastro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [userRole, setUserRole] = useState<'client' | 'professional'>('client');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de login
    if (loginEmail && loginPassword) {
      toast({
        title: "Login realizado com sucesso!",
      });
      navigate('/profile');
    } else {
      toast({
        title: "Erro ao fazer login",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
    }
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!name || !email || !phone || !password || !location) {
      toast({
        title: "Erro ao criar conta",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro ao criar conta",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    // Simulação de cadastro
    toast({
      title: "Conta criada com sucesso!",
      description: `Bem-vindo(a) ao Cuide-Se, ${name}!`,
    });
    navigate('/profile');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
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
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-pink hover:bg-pink/90">
                        Entrar
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
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                          id="phone" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Cidade/Estado</Label>
                        <Input 
                          id="location" 
                          placeholder="São Paulo, SP"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
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
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar senha</Label>
                          <Input 
                            id="confirm-password" 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {userRole === 'professional' && (
                        <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                          Como profissional, você precisará completar seu perfil com informações adicionais após o cadastro.
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full bg-pink hover:bg-pink/90">
                        Criar conta
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
