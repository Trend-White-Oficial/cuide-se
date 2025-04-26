
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockUsers, mockAppointments, mockProfessionals } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  // Mock do usuário logado (primeiro usuário para exemplo)
  const currentUser: User = mockUsers[0];
  
  // Filtrar agendamentos do usuário atual
  const userAppointments = mockAppointments.filter(
    appointment => appointment.clientId === currentUser.id
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar com informações do usuário */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Card className="shadow-sm">
                <CardHeader className="text-center pb-2">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src={currentUser.avatar || 'https://via.placeholder.com/150'} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="mb-1">{currentUser.name}</CardTitle>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Telefone:</span>
                      <span className="text-sm font-medium">{currentUser.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Localização:</span>
                      <span className="text-sm font-medium">{currentUser.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Tipo de conta:</span>
                      <Badge variant="outline" className="capitalize">{currentUser.role}</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6 bg-pink hover:bg-pink/90">
                    Editar Perfil
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Conteúdo principal */}
            <div className="flex-1">
              <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="appointments">Meus Agendamentos</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                
                <TabsContent value="appointments">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Agendamentos Ativos
                  </h2>
                  
                  {userAppointments.filter(a => a.status !== 'completed').length > 0 ? (
                    <div className="space-y-4">
                      {userAppointments
                        .filter(a => a.status !== 'completed')
                        .map((appointment) => {
                          const professional = mockProfessionals.find(
                            p => p.id === appointment.professionalId
                          );
                          
                          const service = professional?.services.find(
                            s => s.id === appointment.serviceId
                          );
                          
                          return (
                            <Card key={appointment.id} className="overflow-hidden">
                              <div className={`h-2 ${
                                appointment.status === 'confirmed' 
                                  ? 'bg-green-500' 
                                  : 'bg-amber-500'
                              }`}></div>
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                      <img 
                                        src={professional?.avatar || ''} 
                                        alt={professional?.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">
                                        {professional?.name} - {professional?.specialty}
                                      </h3>
                                      <p className="text-sm text-gray-600">
                                        {service?.name} ({service?.duration} minutos)
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="text-right md:text-left">
                                    <div className="font-medium">
                                      {appointment.date.split('-').reverse().join('/')} às {appointment.time}
                                    </div>
                                    <Badge className={`
                                      ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                                      ${appointment.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                                    `}>
                                      {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex justify-end gap-2 mt-4">
                                  <Link to={`/professional/${professional?.id}`}>
                                    <Button variant="outline" size="sm">
                                      Ver Profissional
                                    </Button>
                                  </Link>
                                  <Button variant="destructive" size="sm">
                                    Cancelar
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      }
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Você não possui agendamentos ativos.</p>
                      <Link to="/search">
                        <Button className="mt-4 bg-pink hover:bg-pink/90">
                          Buscar Profissionais
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Histórico de Serviços
                  </h2>
                  
                  {userAppointments.filter(a => a.status === 'completed').length > 0 ? (
                    <div className="space-y-4">
                      {userAppointments
                        .filter(a => a.status === 'completed')
                        .map((appointment) => {
                          const professional = mockProfessionals.find(
                            p => p.id === appointment.professionalId
                          );
                          
                          const service = professional?.services.find(
                            s => s.id === appointment.serviceId
                          );
                          
                          return (
                            <Card key={appointment.id} className="overflow-hidden">
                              <div className="h-2 bg-gray-300"></div>
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                      <img 
                                        src={professional?.avatar || ''} 
                                        alt={professional?.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">
                                        {professional?.name} - {professional?.specialty}
                                      </h3>
                                      <p className="text-sm text-gray-600">
                                        {service?.name} ({service?.duration} minutos)
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="text-right md:text-left">
                                    <div className="font-medium">
                                      {appointment.date.split('-').reverse().join('/')} às {appointment.time}
                                    </div>
                                    <Badge className="bg-gray-100 text-gray-800">
                                      Concluído
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex justify-end gap-2 mt-4">
                                  <Button variant="outline" size="sm">
                                    Avaliar Serviço
                                  </Button>
                                  <Link to={`/professional/${professional?.id}`}>
                                    <Button className="bg-pink hover:bg-pink/90" size="sm">
                                      Agendar Novamente
                                    </Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      }
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Você ainda não possui histórico de serviços.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
