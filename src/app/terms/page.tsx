import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">නියම සහ කොන්දේසි</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          අවසන් වරට යාවත්කාලීන කරන ලද්දේ: {new Date().toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>YNS SL ADZONE වෙත සාදරයෙන් පිළිගනිමු!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            මෙම නියම සහ කොන්දේසි ("නියම") YNS SL ADZONE වෙබ් අඩවිය, සේවාවන් සහ යෙදුම් (එකතුව, "වේදිකාව") ඔබගේ භාවිතය පාලනය කරයි. අපගේ වේදිකාවට පිවිසීමෙන් හෝ භාවිතා කිරීමෙන්, ඔබ මෙම නියමයන්ට බැඳී සිටීමට එකඟ වේ. ඔබ මෙම නියමයන්ට එකඟ නොවන්නේ නම්, කරුණාකර අපගේ වේදිකාව භාවිතා නොකරන්න.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">1. පරිශීලක ගිණුම්</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>ඇතැම් විශේෂාංග වෙත පිවිසීමට, ඔබ ගිණුමක් සෑදිය යුතුය. ලියාපදිංචි කිරීමේ ක්‍රියාවලියේදී නිවැරදි, වත්මන්, සහ සම්පූර්ණ තොරතුරු සැපයීමට ඔබ එකඟ වේ. ඔබගේ මුරපදය ආරක්ෂා කිරීම සහ ඔබගේ ගිණුම යටතේ සිදුවන සියලුම ක්‍රියාකාරකම් සඳහා ඔබ වගකිව යුතුය. ඔබගේ ගිණුමේ කිසියම් අනවසර භාවිතයක් පිළිබඳව ඔබ වහාම අපට දැනුම් දිය යුතුය.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">2. දැන්වීම් පළ කිරීම</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>පෙළ, පින්තූර, සහ සම්බන්ධතා තොරතුරු ඇතුළුව, වේදිකාවේ ඔබ පළ කරන සියලුම තොරතුරු, අන්තර්ගතය, සහ ද්‍රව්‍ය ("ඔබගේ අන්තර්ගතය") සඳහා ඔබ තනිවම වගකිව යුතුය. ඔබගේ අන්තර්ගතය පළ කිරීමට ඔබට හිමිකම හෝ අවශ්‍ය අයිතිවාසිකම් ඇති බවටත්, එය කිසිදු නීතියක් හෝ තෙවන පාර්ශවීය අයිතිවාසිකම් උල්ලංඝනය නොකරන බවටත් ඔබ සහතික විය යුතුය.</p>
                <p>මෙම නියමයන් උල්ලංඝනය කරන බවට හෝ වෙනත් ආකාරයකින් විරෝධතා දැක්විය හැකි බවට අපගේ තනි අභිමතය පරිදි අප විශ්වාස කරන ඕනෑම දැන්වීමක් සමාලෝචනය කිරීමට, සංස්කරණය කිරීමට, හෝ ඉවත් කිරීමට YNS SL ADZONE හට අයිතිය ඇත, නමුත් එය බැඳී නොමැත.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">3. තහනම් අන්තර්ගතය සහ හැසිරීම</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>පහත දැක්වෙන කිසිදු අන්තර්ගතයක් පළ නොකිරීමට හෝ එවැනි හැසිරීමක නිරත නොවීමට ඔබ එකඟ වේ:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>නීති විරෝධී, වංචනික, හෝ රැවටිලිකාර.</li>
                  <li>ඕනෑම තෙවන පාර්ශවයක ප්‍රකාශන හිමිකම, පේටන්ට් බලපත්‍රය, වෙළඳ ලකුණ, වෙළඳ රහස, හෝ වෙනත් හිමිකාර අයිතිවාසිකම් උල්ලංඝනය කිරීම.</li>
                  <li>අසභ්‍ය, කාමුක, හෝ ලිංගිකව ප්‍රකාශිත ද්‍රව්‍ය ප්‍රවර්ධනය කිරීම (නීතියට අනුකූලව සහ නියමිත ප්‍රවර්ග වලින් බැහැරව).</li>
                  <li>අපහාසාත්මක, තර්ජනාත්මක, හෝ හිරිහැර කරන.</li>
                  <li>ඕනෑම පුද්ගලයෙකුට හෝ කණ්ඩායමකට එරෙහිව වෙනස්කම් කිරීම, අගතිගාමීත්වය, ජාතිවාදය, වෛරය, හෝ හානිය ප්‍රවර්ධනය කිරීම.</li>
                  <li>අයාචිත තැපැල්, කුණු තැපැල්, දාම ලිපි, හෝ පිරමිඩ යෝජනා ක්‍රම.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">4. ගෙවීම්, සාමාජිකත්ව, සහ බැනර්</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>සාමාජිකත්ව සහ බැනර් දැන්වීම් වැනි ඇතැම් විශේෂාංග සඳහා ගෙවීම් අවශ්‍ය වේ. සියලුම ගෙවීම් තෙවන පාර්ශවීය ගෙවීම් ද්වාර හරහා සිදු කෙරේ. වේදිකාවේ විස්තර කර ඇති පරිදි අදාළ සියලුම ගාස්තු ගෙවීමට ඔබ එකඟ වේ.</p>
                <p>සාමාජිකත්ව සහ බැනර් දැන්වීම් සඳහා වන ගෙවීම් සමාලෝචනයට සහ අනුමැතියට යටත් වේ. පරිපාලකයෙකු ඔබගේ ගෙවීම් තහවුරු කිරීම (උදා: බැංකු පත්‍රිකාව) සමාලෝචනය කරනු ඇත. සේවාව සක්‍රිය කරනු ලබන්නේ අනුමැතිය මත පමණි. ඕනෑම හේතුවක් මත ඕනෑම ගෙවීමක් ප්‍රතික්ෂේප කිරීමට සහ සේවාව ප්‍රතික්ෂේප කිරීමට අපට අයිතිය ඇත. සේවාවක් අනුමත කර සක්‍රිය කළ පසු සියලුම ගාස්තු ආපසු ගෙවනු නොලැබේ.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">5. වගකීම් ප්‍රතික්ෂේප කිරීම</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>වේදිකාව "පවතින ආකාරයටම" සහ "ලබා ගත හැකි පරිදි" කිසිදු ආකාරයක, ප්‍රකාශිත හෝ ව්‍යංග, වගකීමකින් තොරව සපයනු ලැබේ. YNS SL ADZONE වේදිකාව අඛණ්ඩව, ආරක්ෂිතව, හෝ දෝෂ රහිතව පවතිනු ඇති බවට සහතික නොවේ. වේදිකාව හරහා ලබා ගන්නා ඕනෑම අන්තර්ගතයක ගුණාත්මකභාවය, නිරවද්‍යතාවය, කාලෝචිත බව, සත්‍යතාව, සම්පූර්ණත්වය, හෝ විශ්වසනීයත්වය පිළිබඳව අපි කිසිදු වගකීමක් නොගනිමු.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-semibold">6. වගකීම් සීමා කිරීම</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>අදාළ නීතියෙන් අවසර දී ඇති උපරිම ප්‍රමාණයට, (අ) ඔබගේ ප්‍රවේශය හෝ භාවිතය හෝ වේදිකාවට පිවිසීමට හෝ භාවිතා කිරීමට නොහැකි වීම; (ආ) වේදිකාවේ ඕනෑම තෙවන පාර්ශවයක ඕනෑම හැසිරීමක් හෝ අන්තර්ගතයක්; හෝ (ඇ) ඔබගේ සම්ප්‍රේෂණ හෝ අන්තර්ගතයේ අනවසර ප්‍රවේශය, භාවිතය, හෝ වෙනස් කිරීම හේතුවෙන් පැන නගින, වක්‍ර, අහඹු, විශේෂ, ප්‍රතිවිපාක, හෝ දණ්ඩනීය හානි, හෝ ලාභ හෝ ආදායම් අහිමි වීම, දත්ත, භාවිතය, හොඳහිත, හෝ වෙනත් අස්පෘශ්‍ය අලාභ සඳහා YNS SL ADZONE වගකිව යුතු නොවේ.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-semibold">7. වන්දි ගෙවීම</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>ඔබගේ වේදිකාවට ප්‍රවේශ වීම හෝ භාවිතය හෝ මෙම නියමයන් උල්ලංඝනය කිරීම සම්බන්ධයෙන් පැන නගින ඕනෑම සහ සියලුම හිමිකම්, ආරවුල්, ඉල්ලීම්, වගකීම්, හානි, අලාභ, සහ පිරිවැය සහ වියදම්, සීමාවකින් තොරව, සාධාරණ නීතිමය සහ ගිණුම්කරණ ගාස්තු ඇතුළුව, YNS SL ADZONE සහ එහි නිලධාරීන්, අධ්‍යක්ෂවරුන්, සේවකයින්, සහ නියෝජිතයින්ට වන්දි ගෙවීමට සහ ඔවුන් හානිවලින් නිදහස් කිරීමට ඔබ එකඟ වේ.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-semibold">8. නියමයන්හි වෙනස්කම්</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>අපට ඕනෑම වේලාවක මෙම නියමයන් වෙනස් කළ හැකිය. එසේ කළහොත්, වෙබ් අඩවියේ වෙනස් කළ නියමයන් පළ කිරීමෙන් හෝ වෙනත් සන්නිවේදන මාර්ග හරහා අපි ඔබට දන්වන්නෙමු. අප වෙනස් කළ විට නියමයන් සමාලෝචනය කිරීම වැදගත් වේ, કારણ કે අප වෙනස් කළ නියමයන් පළ කිරීමෙන් පසුව ඔබ වේදිකාව දිගටම භාවිතා කරන්නේ නම්, ඔබ වෙනස් කළ නියමයන්ට බැඳී සිටීමට එකඟ වන බව අපට දන්වයි.</p>
              </AccordionContent>
            </AccordionItem>
            
             <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-semibold">9. පාලන නීතිය</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>මෙම නියමයන් සහ ඊට අදාළ ඕනෑම ක්‍රියාවක්, එහි නීති ගැටුම් විධිවිධාන නොසලකා හරිමින්, ශ්‍රී ලංකා ප්‍රජාතන්ත්‍රවාදී සමාජවාදී ජනරජයේ නීති මගින් පාලනය වේ.</p>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
