import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Mail, Phone, MapPin, CreditCard, Users, Gift } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    location: 'São Paulo, SP',
    document: {
      type: 'cpf',
      number: '123.456.789-00'
    },
    type: 'professional',
    credits: 50,
    referralCode: 'MARIA123',
    referrals: [
      {
        name: 'Ana Paula',
        email: 'ana.paula@email.com',
        status: 'active',
        date: '2024-02-01'
      },
      {
        name: 'Carla Santos',
        email: 'carla.santos@email.com',
        status: 'pending',
        date: '2024-02-10'
      }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-pink/10 rounded-full flex items-center justify-center">
              <UserCircle className="w-12 h-12 text-pink" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500">
                <Badge className={profile.type === 'professional' ? 'bg-pink-light text-pink' : 'bg-blue-100 text-blue-800'}>
                  {profile.type === 'professional' ? 'Profissional' : 'Cliente'}
                </Badge>
              </p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="referrals">Indicações</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Gerencie suas informações pessoais e de contato
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nome</label>
                        <Input value={profile.name} readOnly />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input value={profile.email} readOnly />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Telefone</label>
                        <Input value={profile.phone} readOnly />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Localização</label>
                        <Input value={profile.location} readOnly />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {profile.document.type.toUpperCase()}
                        </label>
                        <Input value={profile.document.number} readOnly />
                      </div>
                    </div>
                    <Button className="bg-pink hover:bg-pink/90">
                      Editar Informações
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Créditos e Benefícios</CardTitle>
                    <CardDescription>
                      Acompanhe seus créditos e código de indicação
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-pink/10 rounded-full flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-pink" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Créditos Disponíveis</p>
                          <p className="text-2xl font-bold text-gray-900">R$ {profile.credits},00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-pink/10 rounded-full flex items-center justify-center">
                          <Gift className="w-6 h-6 text-pink" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Código de Indicação</p>
                          <p className="text-2xl font-bold text-gray-900">{profile.referralCode}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="referrals">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Amigas Indicadas</CardTitle>
                      <CardDescription>
                        Acompanhe suas indicações e ganhe créditos
                      </CardDescription>
                    </div>
                    <Button className="bg-pink hover:bg-pink/90">
                      <Users className="w-4 h-4 mr-2" />
                      Indicar Amiga
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.referrals.map((referral, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-pink/10 rounded-full flex items-center justify-center">
                            <UserCircle className="w-6 h-6 text-pink" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{referral.name}</p>
                            <p className="text-sm text-gray-500">{referral.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              referral.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {referral.status === 'active' ? 'Ativa' : 'Pendente'}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(referral.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage; 