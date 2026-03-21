export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    content: string;
    coverPhoto: string;
    category: string;
    date: string;
    author: string;
}

export const blogs: BlogPost[] = [
    {
        slug: "the-art-of-cinematic-weddings",
        title: "The Art of Cinematic Weddings: More Than Just a Video",
        category: "TIPS & TRICKS",
        date: "March 15, 2026",
        author: "Sharthak Studio",
        description: "Explore how we turn your special day into a cinematic masterpiece using professional camera movements and storytelling techniques.",
        coverPhoto: "https://picsum.photos/seed/blog-1/2400/1200",
        content: `
# Storytelling is the Heart of Cinematic Weddings

When you look back at your wedding day, you shouldn't just see a sequence of events. You should feel the heartbeats, the laughter, and the silent tears of joy. That is the difference between a traditional wedding video and cinematic wedding cinematography.

## Why Cinematography Matters
Traditional videography focuses on a linear record of what happened. Cinematography at Sharthak Studio focuses on the *feeling*. We use 4K cinema cameras, prime lenses with deep bokeh, and specialized rigs like gimbals and cranes to create that Hollywood look.

## The Secret Ingredient: Sound Design
We don't just put music over your video. We record crisp ambient sounds — the rustle of the dress, the crackle of fire in the Havana, the clear audio of your vows. These layers of sound bring the visual to life.

## Conclusion
Your wedding is your story. Let's make it a masterpiece.
        `
    },
    {
        slug: "choosing-the-perfect-pre-wedding-location",
        title: "Choosing the Perfect Pre-Wedding Location in Bihar",
        category: "LOCATIONS",
        date: "March 20, 2026",
        author: "Sharthak Studio Team",
        description: "From the heritage of Gaya and Bodhgaya to the modern vibes of Patna, we list the best spots for your pre-wedding shoot.",
        coverPhoto: "https://picsum.photos/seed/blog-2/2400/1200",
        content: `
# Hidden Gems for Pre-Wedding Shoots in Bihar

Looking for that perfect backdrop for your pre-wedding photos? Bihar offers a unique blend of heritage, spiritual serenity, and raw nature.

## 1. Bodhgaya Templates
The Mahabodhi Temple and surrounding monasteries offer an architectural grandeur that is unmatched. The golden hour here creates a divine glow on the couple's faces.

## 2. Patna Marine Drive
For couples who want a modern, urban feel, the newly developed Ganga Path offers sweeping views of the river and sleek bridge architecture.

## 3. Gaya - Falgu River Banks
The vast expanse of the Falgu riverbanks at sunrise is a photographer's paradise. The minimalist sand and reflection in water make the couple stand out.

## Final Tip
Always visit your location at the time you plan to shoot. Lighting changes everything.
        `
    }
];
