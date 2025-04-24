
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    appName: 'Cuide-Se',
    contactEmail: 'contato@cuide-se.com',
    contactPhone: '(11) 99999-9999',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    reminderHours: '24',
    emailTemplate: 'Olá {nome}, seu agendamento está confirmado para {data} às {hora} com {profissional}. Agradecemos a preferência!'
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    primaryColor: '#FF007F',
    secondaryColor: '#FFD1DC',
    showRatings: true,
    showPrices: true,
    enableDarkMode: false,
    itemsPerPage: '12'
  });
  
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleChange = (name: string, checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDisplaySettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDisplayToggle = (name: string, checked: boolean) => {
    setDisplaySettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const saveSettings = (settingType: string) => {
    // In a real app, this would save to backend
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${settingType} foram atualizadas com sucesso.`
    });
  };
  
  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem. Tente novamente."
      });
      return;
    }
    
    if (accountSettings.newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter pelo menos 8 caracteres."
      });
      return;
    }
    
    // In a real app, this would verify current password and change to new password
    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso."
    });
    
    // Reset form
    setAccountSettings({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <AdminLayout title="Configurações">
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="display">Aparência</TabsTrigger>
            <TabsTrigger value="account">Conta Admin</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Informações básicas e de contato do aplicativo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="appName">Nome do Aplicativo</Label>
                    <Input
                      id="appName"
                      name="appName"
                      value={generalSettings.appName}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email de Contato</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Telefone de Contato</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      value={generalSettings.address}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-pink hover:bg-pink/90" onClick={() => saveSettings('geral')}>
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Gerenciamento de alertas e lembretes para clientes e profissionais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={notificationSettings.enableEmailNotifications}
                      onCheckedChange={(checked) => handleToggleChange('enableEmailNotifications', checked)}
                      id="enableEmailNotifications"
                    />
                    <Label htmlFor="enableEmailNotifications">Habilitar notificações por email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={notificationSettings.enableSMSNotifications}
                      onCheckedChange={(checked) => handleToggleChange('enableSMSNotifications', checked)}
                      id="enableSMSNotifications"
                    />
                    <Label htmlFor="enableSMSNotifications">Habilitar notificações por SMS</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={notificationSettings.enablePushNotifications}
                      onCheckedChange={(checked) => handleToggleChange('enablePushNotifications', checked)}
                      id="enablePushNotifications"
                    />
                    <Label htmlFor="enablePushNotifications">Habilitar notificações push</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminderHours">Horas de antecedência para lembrete</Label>
                    <Input
                      id="reminderHours"
                      name="reminderHours"
                      type="number"
                      min="1"
                      max="72"
                      value={notificationSettings.reminderHours}
                      onChange={handleNotificationChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label htmlFor="emailTemplate">Template de Email de Confirmação</Label>
                  <Textarea
                    id="emailTemplate"
                    name="emailTemplate"
                    rows={4}
                    value={notificationSettings.emailTemplate}
                    onChange={handleNotificationChange}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {`{nome}`}, {`{data}`}, {`{hora}`}, {`{profissional}`}, {`{servico}`} como variáveis substituíveis.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-pink hover:bg-pink/90" onClick={() => saveSettings('notificações')}>
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Display Settings */}
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência e exibição de elementos no aplicativo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        name="primaryColor"
                        type="color"
                        value={displaySettings.primaryColor}
                        onChange={handleDisplayChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input 
                        type="text" 
                        value={displaySettings.primaryColor} 
                        onChange={handleDisplayChange}
                        name="primaryColor"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="color"
                        value={displaySettings.secondaryColor}
                        onChange={handleDisplayChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input 
                        type="text" 
                        value={displaySettings.secondaryColor} 
                        onChange={handleDisplayChange}
                        name="secondaryColor"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemsPerPage">Itens por página</Label>
                    <Input
                      id="itemsPerPage"
                      name="itemsPerPage"
                      type="number"
                      min="4"
                      max="50"
                      value={displaySettings.itemsPerPage}
                      onChange={handleDisplayChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={displaySettings.showRatings}
                      onCheckedChange={(checked) => handleDisplayToggle('showRatings', checked)}
                      id="showRatings"
                    />
                    <Label htmlFor="showRatings">Mostrar avaliações dos profissionais</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={displaySettings.showPrices}
                      onCheckedChange={(checked) => handleDisplayToggle('showPrices', checked)}
                      id="showPrices"
                    />
                    <Label htmlFor="showPrices">Mostrar preços dos serviços</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={displaySettings.enableDarkMode}
                      onCheckedChange={(checked) => handleDisplayToggle('enableDarkMode', checked)}
                      id="enableDarkMode"
                    />
                    <Label htmlFor="enableDarkMode">Habilitar modo escuro</Label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-pink hover:bg-pink/90" onClick={() => saveSettings('aparência')}>
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta de Administrador</CardTitle>
                <CardDescription>
                  Altere suas credenciais de acesso ao painel administrativo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={changePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={accountSettings.currentPassword}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={accountSettings.newPassword}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={accountSettings.confirmPassword}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="bg-pink hover:bg-pink/90 mt-2">
                    Alterar Senha
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Configurações avançadas e técnicas do aplicativo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 border-b">
                    <h4 className="text-sm font-medium">Exportar Dados</h4>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Exporte todos os dados do aplicativo em formato JSON para backup ou migração.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline">Exportar Usuários</Button>
                        <Button variant="outline">Exportar Agendamentos</Button>
                        <Button variant="outline">Exportar Tudo</Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 border-b">
                    <h4 className="text-sm font-medium">Configurações de API</h4>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">Chave de API</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="apiKey"
                            type="text"
                            value="sk_test_****************************************"
                            disabled
                            className="flex-grow"
                          />
                          <Button variant="outline">Revelar</Button>
                          <Button variant="outline">Regenerar</Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Esta é sua chave secreta de API. Não compartilhe com ninguém.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 border-b">
                    <h4 className="text-sm font-medium">Integrações</h4>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="googleCalendar" />
                          <Label htmlFor="googleCalendar">Google Calendar</Label>
                        </div>
                        <Button variant="outline" className="w-full md:w-auto">Configurar</Button>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="whatsapp" />
                          <Label htmlFor="whatsapp">WhatsApp Business API</Label>
                        </div>
                        <Button variant="outline" className="w-full md:w-auto">Configurar</Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
