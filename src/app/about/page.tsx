import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Phone, Rocket, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">YNS SL ADZONE ගැන</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          ශ්‍රී ලංකාවේ වේගයෙන්ම වර්ධනය වන වර්ගීකෘත දැන්වීම් වේදිකාව.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-primary">අපගේ මෙහෙවර</h2>
          <p className="text-muted-foreground leading-relaxed">
            අපගේ මෙහෙවර වන්නේ ශ්‍රී ලංකාව පුරා ගැනුම්කරුවන් සහ විකුණුම්කරුවන් සම්බන්ධ කරන සරල, විශ්වාසනීය සහ පරිශීලක-හිතකාමී වේදිකාවක් නිර්මාණය කිරීමයි. පුද්ගලයන් සහ කුඩා ව්‍යාපාර සවිබල ගැන්වීම සඳහා, භාණ්ඩ හා සේවා වෙළඳාම් කිරීමට ඵලදායී වෙළඳපොළක් ලබා දීම, සහ සජීවී සහ සහයෝගී මාර්ගගත ප්‍රජාවක් පෝෂණය කිරීම අපගේ අරමුණයි.
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
          <h2 className="text-3xl font-bold mb-4 text-primary">අපගේ දැක්ම</h2>
          <p className="text-muted-foreground leading-relaxed">
            YNS SL ADZONE ශ්‍රී ලංකාවේ වර්ගීකෘත දැන්වීම් සඳහා අංක එකේ ගමනාන්තය බවට පත් කිරීම අපගේ දැක්මයි. එහි පුළුල් ප්‍රවේශය, විශ්වසනීයත්වය සහ නවෝත්පාදනය සඳහා ප්‍රසිද්ධියට පත්වීම අපගේ අරමුණයි. අපගේ පරිශීලකයින්ගේ විකාශනය වන අවශ්‍යතා සපුරාලීමට සහ දේශීය ආර්ථිකයට ධනාත්මකව දායක වීමට අපගේ වේදිකාව අඛණ්ඩව වැඩිදියුණු කිරීමට අපි කැපවී සිටිමු.
          </p>
        </div>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>අප හා සම්බන්ධ වන්න</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            අපි සැමවිටම උදව් කිරීමට මෙහි සිටිමු. ඔබට අපගේ සේවාවන් පිළිබඳව ප්‍රශ්නයක් ඇත්නම්, ඔබගේ දැන්වීම සම්බන්ධයෙන් සහාය අවශ්‍ය නම්, හෝ ප්‍රතිපෝෂණ ලබා දීමට අවශ්‍ය නම්, කරුණාකර අප හා සම්බන්ධ වීමට පසුබට නොවන්න.
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
                J A Y S Kavinada, 198/b එතනමඩල, කළුතර උතුර
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
