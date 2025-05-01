import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageSquare, HelpCircle, FileText, Shield, UserPlus } from 'lucide-react';
import { ChatBox } from '@/components/ui/chat-box';

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [friendMessage, setFriendMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envio do formulário
    console.log('Formulário enviado:', formData);
  };

  const handleFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envio da indicação
    console.log('Indicação enviada:', { friendName, friendEmail, friendPhone, friendMessage });
    setSubmitted(true);
  };

  const supportOptions = [
    {
      icon: HelpCircle,
      title: 'Perguntas Frequentes',
      description: 'Encontre respostas para as dúvidas mais comuns sobre nossa plataforma.',
      link: '/faq'
    },
    {
      icon: FileText,
      title: 'Documentação',
      description: 'Acesse nossa documentação completa para profissionais e usuários.',
      link: '/docs'
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Saiba mais sobre as medidas de segurança que implementamos.',
      link: '/security'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Como podemos ajudar?</h1>
            <p className="text-gray-600">
              Estamos aqui para ajudar você com qualquer dúvida ou problema que possa ter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-pink/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-pink" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Entre em Contato</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e nossa equipe entrará em contato em breve.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nome
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Assunto
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mensagem
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-pink hover:bg-pink/90">
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                  <CardDescription>
                    Você também pode nos contatar diretamente através dos canais abaixo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-pink" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">suporte@cuide-se.com.br</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-pink" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-gray-600">(11) 91753-6971</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-pink" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-gray-600">(11) 91753-6971</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horário de Atendimento</CardTitle>
                  <CardDescription>
                    Nossa equipe está disponível nos seguintes horários.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Segunda a Sexta:</span> 9h às 18h
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Sábado:</span> 9h às 13h
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Domingo:</span> Fechado
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-pink" />
                <CardTitle>Indique sua amiga</CardTitle>
              </div>
              <CardDescription>
                Compartilhe o Cuide-Se com suas amigas e ganhe benefícios exclusivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Indicação enviada!</h3>
                  <p className="text-gray-600">
                    Sua amiga receberá um convite especial para se juntar ao Cuide-Se.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFriendSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="friendName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da sua amiga
                    </label>
                    <Input
                      id="friendName"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="friendEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email da sua amiga
                    </label>
                    <Input
                      id="friendEmail"
                      type="email"
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="friendPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone da sua amiga
                    </label>
                    <Input
                      id="friendPhone"
                      value={friendPhone}
                      onChange={(e) => setFriendPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="friendMessage" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem (opcional)
                    </label>
                    <Textarea
                      id="friendMessage"
                      value={friendMessage}
                      onChange={(e) => setFriendMessage(e.target.value)}
                      placeholder="Deixe uma mensagem para sua amiga..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-pink hover:bg-pink/90">
                    Enviar indicação
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <ChatBox />
    </div>
  );
};

export default SupportPage; 