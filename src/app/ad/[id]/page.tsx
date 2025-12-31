'use client';

import { useParams, usePathname } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, where, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Tag, Phone, User, Calendar, Text, Share2, Copy, Heart, MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

function AdDetailSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl py-12">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="w-20 h-20 rounded" />
                        <Skeleton className="w-20 h-20 rounded" />
                        <Skeleton className="w-20 h-20 rounded" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-12 w-1/2" />
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                         <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                         <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </div>
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        </div>
    );
}

function CommentSection({ adId }: { adId: string }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const commentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, `ads/${adId}/comments`), orderBy('createdAt', 'desc'));
    }, [firestore, adId]);

    const { data: comments, isLoading } = useCollection<any>(commentsQuery);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ variant: 'destructive', title: 'අනවසරයි', description: 'අදහස් දැක්වීමට කරුණාකර පිවිසෙන්න.' });
            return;
        }
        if (!commentText.trim() || !firestore) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, `ads/${adId}/comments`), {
                adId: adId,
                userId: user.uid,
                userEmail: user.email,
                text: commentText,
                createdAt: serverTimestamp(),
            });
            setCommentText('');
            toast({ title: 'සාර්ථකයි', description: 'ඔබගේ අදහස පළ කරන ලදී.' });
        } catch (error: any) {
            console.error("Error posting comment:", error);
            toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'අදහස පළ කිරීමට නොහැකි විය: ' + error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    අදහස්
                </CardTitle>
            </CardHeader>
            <CardContent>
                {user && (
                    <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4 mb-6">
                        <Textarea
                            placeholder="ඔබගේ අදහස මෙහි ටයිප් කරන්න..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <Button type="submit" disabled={isSubmitting || !commentText.trim()} className="self-end">
                            {isSubmitting ? 'පළ කරමින්...' : 'අදහස පළ කරන්න'}
                        </Button>
                    </form>
                )}
                <div className="space-y-6">
                    {isLoading ? (
                        <Skeleton className="h-16 w-full" />
                    ) : comments && comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-3">
                                <Avatar>
                                    <AvatarFallback>{comment.userEmail ? comment.userEmail.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm">{comment.userEmail || 'Anonymous'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : ''}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">තවමත් අදහස් කිසිවක් නොමැත. පළමුවැන්නා වන්න!</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdDetailPage() {
    const { id } = useParams();
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();

    const adId = Array.isArray(id) ? id[0] : id;

    const adRef = useMemoFirebase(() => {
        if (!firestore || !adId) return null;
        return doc(firestore, 'ads', adId);
    }, [firestore, adId]);

    const { data: ad, isLoading, error } = useDoc<any>(adRef);

    // Likes
    const likesQuery = useMemoFirebase(() => {
        if (!firestore || !adId) return null;
        return collection(firestore, `ads/${adId}/likes`);
    }, [firestore, adId]);
    const { data: likes } = useCollection(likesQuery);
    
    const userLikeQuery = useMemoFirebase(() => {
        if (!firestore || !adId || !user) return null;
        return query(collection(firestore, `ads/${adId}/likes`), where('userId', '==', user.uid));
    }, [firestore, adId, user]);
    const { data: userLike } = useCollection(userLikeQuery);

    const hasLiked = userLike && userLike.length > 0;
    const likeCount = likes?.length || 0;

    const handleLike = async () => {
        if (!user || !firestore || !adId) {
            toast({ variant: 'destructive', title: 'අනවසරයි', description: 'කැමති වීමට කරුණාකර පිවිසෙන්න.' });
            return;
        }

        const likeRef = collection(firestore, `ads/${adId}/likes`);
        if (hasLiked) {
            // Unlike
            const likeDoc = userLike?.[0];
            if (likeDoc) {
                await deleteDoc(doc(firestore, `ads/${adId}/likes`, likeDoc.id));
            }
        } else {
            // Like
            await addDoc(likeRef, { userId: user.uid, adId: adId });
        }
    };
    
    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: "සබැඳිය පිටපත් කරන ලදී!",
                description: "දැන්වීමේ සබැඳිය ඔබගේ ක්ලිප්බෝඩ් එකට පිටපත් කරන ලදී.",
            });
        });
    };

    if (isLoading) {
        return <AdDetailSkeleton />;
    }

    if (error) {
        return <div className="text-center py-12 text-destructive">දැන්වීම පූරණය කිරීමේ දෝෂයකි: {error.message}</div>;
    }

    if (!ad) {
        return <div className="text-center py-12 text-muted-foreground">දැන්වීම හමු නොවීය.</div>;
    }
    
    const postedAt = ad.createdAt?.toDate() 
        ? formatDistanceToNow(ad.createdAt.toDate(), { addSuffix: true }) 
        : 'N/A';
        
    const adUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `YNS SL ADZONE හි මෙම දැන්වීම බලන්න: ${ad.title}`;

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{ad.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{ad.district}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>පළ කරන ලදී {postedAt}</span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4"/>
                    <span>{likeCount} කැමතියි</span>
                </div>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {ad.imageUrls.map((url: string, index: number) => (
                                <CarouselItem key={index}>
                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                        <Image src={url} alt={`${ad.title} - image ${index + 1}`} fill className="object-cover" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </Carousel>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-3xl text-primary">
                                <Tag className="w-8 h-8" />
                                <span>රු. {ad.price.toLocaleString()}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <h3 className="font-semibold flex items-center gap-2"><Phone className="w-5 h-5 text-muted-foreground"/>සම්බන්ධ කරගන්න</h3>
                                <p className="text-lg text-foreground">{ad.phoneNumber}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><User className="w-5 h-5 text-muted-foreground"/>විකුණුම්කරුගේ තොරතුරු</h3>
                                <p className="text-muted-foreground">පරිශීලක ID: {ad.userId.substring(0,8)}...</p>
                            </div>
                             <div>
                                <h3 className="font-semibold flex items-center gap-2"><Text className="w-5 h-5 text-muted-foreground"/>ප්‍රවර්ගය</h3>
                                <Badge variant="secondary">{ad.categoryId}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                     {user && (
                        <Button variant={hasLiked ? "secondary" : "default"} onClick={handleLike} className="w-full mt-4">
                            <Heart className={`mr-2 h-4 w-4 ${hasLiked ? '' : 'fill-current'}`} />
                            {hasLiked ? 'කැමති' : 'කැමති වන්න'}
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">විස්තරය</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{ad.description}</p>
            </div>
            
            <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-bold mb-4">මෙම දැන්වීම බෙදාගන්න</h2>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="icon">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(adUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="icon">
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(adUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1.4-2.1 2.1c-1.1 1.1-2.2 2.3-2.3 2.4s-1.2 1.1-2.2 1.1c-.8 0-1.1-1.1-1.1-1.1s-1.1-1.1-2.3-1.1c-1.1 0-2.1 1.1-2.1 1.1s-1.1 1.1-2.3 1.1c-1 0-2.1-1.1-2.1-1.1s-1.1-1-2.2-1.1c-1.1 0-2.1 1.1-2.1 1.1s-.7-1.1-1.1-1.1c-.3 0-1.1.2-1.1.2s-2.1-1-2.8-2.2c-.8-1.1-1.1-2.2-1.1-2.2s.3-1.1 1.1-2.2c.8-1.2 2.2-2.3 2.2-2.3s1.2 1.1 2.3 2.3c1.1 1.1 2.3 2.3 3.4 2.3s2.3-2.3 2.3-2.3l.2-.2s1.1 1.1 2.3 1.1c1.1 0 2.2-1.1 2.2-1.1s1.1-1.1 2.3-1.1c.9 0 1.9.6 1.9.6s-1.1-2.1-2.2-3.2c-1.1-1.1-2.3-2.3-3.4-2.3s-2.3 1.1-2.3 1.1l-.2.2s-1.1-1.1-2.3-1.1c-1.1 0-2.2 1.1-2.2 1.1z"/></svg>
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="icon">
                        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + adUrl)}`} data-action="share/whatsapp/share" target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </a>
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleCopyLink} aria-label="Copy Link">
                        <Copy className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            
            <CommentSection adId={adId} />

        </div>
    );
}