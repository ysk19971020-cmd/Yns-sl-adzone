import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Terms and Conditions</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to AdZone Lanka!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            These Terms and Conditions ("Terms") govern your use of the AdZone Lanka website, services, and applications (collectively, the "Platform"). By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Platform.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">1. User Accounts</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>To access certain features, you must create an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">2. Posting Ads</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>You are solely responsible for all information, content, and materials you post on the Platform, including but not limited to text, images, and contact information ("Your Content"). You warrant that you own or have the necessary rights to post Your Content and that it does not violate any laws or third-party rights.</p>
                <p>AdZone Lanka reserves the right, but is not obligated, to review, edit, or remove any ad that we believe, in our sole discretion, violates these Terms or is otherwise objectionable.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">3. Prohibited Content & Conduct</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>You agree not to post any content or engage in any conduct that is:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Illegal, fraudulent, or deceptive.</li>
                  <li>Infringing on any third party's copyright, patent, trademark, trade secret, or other proprietary rights.</li>
                  <li>Obscene, pornographic, or promoting sexually explicit materials (outside of designated categories and in compliance with the law).</li>
                  <li>Defamatory, threatening, or harassing.</li>
                  <li>Promoting discrimination, bigotry, racism, hatred, or harm against any individual or group.</li>
                  <li>Spam, junk mail, chain letters, or pyramid schemes.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">4. Payments, Memberships, and Banners</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>Certain features, such as memberships and banner ads, require payment. All payments are processed through third-party payment gateways. You agree to pay all applicable fees as described on the Platform.</p>
                <p>Payments for memberships and banner ads are subject to review and approval. An administrator will review your payment confirmation (e.g., bank slip). The service will be activated only upon approval. We reserve the right to reject any payment and refuse service for any reason. All fees are non-refundable once a service has been approved and activated.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">5. Disclaimer of Warranties</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied. AdZone Lanka does not warrant that the Platform will be uninterrupted, secure, or error-free. We make no warranty regarding the quality, accuracy, timeliness, truthfulness, completeness, or reliability of any content obtained through the Platform.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-semibold">6. Limitation of Liability</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>To the maximum extent permitted by applicable law, AdZone Lanka shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Platform; (b) any conduct or content of any third party on the Platform; or (c) unauthorized access, use, or alteration of your transmissions or content.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-semibold">7. Indemnification</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>You agree to indemnify and hold harmless AdZone Lanka and its officers, directors, employees, and agents from and against any claims, disputes, demands, liabilities, damages, losses, and costs and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Platform or your violation of these Terms.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-semibold">8. Changes to Terms</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>We may modify these Terms at any time. If we do so, we'll let you know either by posting the modified Terms on the site or through other communications. It's important that you review the Terms whenever we modify them because if you continue to use the Platform after we have posted modified Terms, you are indicating to us that you agree to be bound by the modified Terms.</p>
              </AccordionContent>
            </AccordionItem>
            
             <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-semibold">9. Governing Law</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>These Terms and any action related thereto will be governed by the laws of the Democratic Socialist Republic of Sri Lanka without regard to its conflict of laws provisions.</p>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
