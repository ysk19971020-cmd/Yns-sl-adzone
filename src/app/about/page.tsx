import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Phone, Rocket, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">About AdZone Lanka</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sri Lanka's fastest-growing classified advertising platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is to create a simple, reliable, and user-friendly platform that connects buyers and sellers across Sri Lanka. We aim to empower individuals and small businesses by providing an effective marketplace to trade goods and services, fostering a vibrant and supportive online community.
          </p>
        </div>
        <div className="flex justify-center">
            <Target className="w-40 h-40 text-accent" />
        </div>
      </div>
      
       <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
         <div className="flex justify-center order-last md:order-first">
            <Rocket className="w-40 h-40 text-accent" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 text-primary">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            We envision AdZone Lanka as the number one destination for classifieds in Sri Lanka, known for its extensive reach, trustworthiness, and innovation. We are committed to continuously improving our platform to meet the evolving needs of our users and to contribute positively to the local economy.
          </p>
        </div>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Get In Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            We are always here to help. Whether you have a question about our services, need assistance with your ad, or just want to provide feedback, please don't hesitate to reach out.
          </p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-primary" />
              <a href="mailto:ysk19971020@gmail.com" className="text-foreground hover:underline">
                ysk19971020@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-primary" />
              <a href="tel:0771248610" className="text-foreground hover:underline">
                0771248610 (Normal & WhatsApp)
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Building2 className="w-6 h-6 text-primary" />
              <p className="text-foreground">
                J A Y S Kavinada, 198/b ethanamadala, kaluthara north
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
