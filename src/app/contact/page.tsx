import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, User } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We'd love to hear from you! Please reach out with any questions or feedback.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Contact Information</CardTitle>
          <CardDescription>
            You can reach us through any of the following channels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Name</h3>
              <p className="text-muted-foreground">J A Y S Kavinada</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Address</h3>
              <p className="text-muted-foreground">198/b ethanamadala, kaluthara north</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Phone / WhatsApp</h3>
              <a href="tel:0771248610" className="text-muted-foreground hover:text-primary hover:underline">
                0771248610
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <a href="mailto:ysk19971020@gmail.com" className="text-muted-foreground hover:text-primary hover:underline">
                ysk19971020@gmail.com
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
