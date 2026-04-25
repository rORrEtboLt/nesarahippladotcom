// Blog posts authored inline. Keeping them as JS modules lets us avoid
// configuring a markdown loader in Create React App. To add a new post,
// append an object below and the Blog panel picks it up automatically.

const posts = [
  {
    slug: 'art-in-everything',
    title: 'Art in everything',
    date: '2026-04-20',
    excerpt: 'Why I stopped treating art as a separate activity.',
    tags: ['making', 'philosophy', 'life'],
    content: `# Art in everything

I used to keep the categories separate. Programmer. Artist. Builder. Farmer. Coffee person.

The categories made it easier to explain myself, but they weren't honest. They implied that each thing lived in a different room, and that I stepped between them. That's not how it feels from the inside.

The truth is closer to this: when I'm roasting coffee, I'm tasting color. When I'm building a mud wall, I'm reading a material the way you read a poem — slowly, with your whole body, open to being surprised. When I write code, I'm looking for the same thing I look for in a good pot from the kiln: a form that serves its purpose so fully that it seems inevitable.

I think "art" is not a category of activity. It's a quality of attention.

## The attention test

Something is made with art when the maker was fully present — when they noticed what the material was doing, listened to what the work wanted to become, and made decisions that reflected genuine care rather than just efficiency.

By that definition, I've met farmers who are great artists. I've seen code that's a work of art. I've also seen paintings made without any real attention at all.

## Why this matters

It matters because the category of "artist" can become a cage. It implies a certain kind of output (visual, precious, for galleries), a certain kind of person (sensitive, slightly impractical), and a certain kind of time (separate from regular life).

I prefer to think about the quality of attention I bring to whatever I'm doing. Am I fully here? Am I noticing what's happening? Am I willing to be changed by it?

That standard applies to writing a function, kneading clay, sailing across a headwind, or sitting with a dog in the evening.

Everything you do carefully is a form of art. That's not a metaphor. That's the thing itself.

— Nesara
`,
  },
  {
    slug: 'roasting-coffee',
    title: 'Learning to roast coffee in the town where it grows',
    date: '2026-03-10',
    excerpt: 'Notes from a first-generation home roaster in Chikmaglur.',
    tags: ['coffee', 'chikmaglur', 'craft'],
    content: `# Learning to roast coffee in the town where it grows

Chikmaglur has grown coffee for over three hundred years. The Baba Budan hills were named for the Sufi saint who, legend says, brought seven seeds from Yemen in the 1600s, smuggled in his beard, and planted them on these slopes.

I grew up surrounded by coffee estates. The smell of ripe cherries fermenting on tarpaulins. The green hiss of the pulping machines. The low sheds where beans dry on raised beds for weeks. I knew all of this as background, the way you know the weather — not something you think about, just something that is.

It took me until I was an adult to realize I didn't actually know anything about coffee.

## The green bean problem

When you buy roasted coffee, you're buying a finished product. You taste the roaster's decisions. Home roasting is different: you start with something that smells like fresh-cut hay and tastes of nothing useful, and you are responsible for transforming it.

Green beans carry all the flavor precursors — acids, sugars, amino acids — but none of the flavors themselves. Heat is the catalyst. The Maillard reaction turns sugars and amino acids into hundreds of new aromatic compounds. Caramelization takes over later. The roaster's job is to apply heat in a way that develops the good things and drives off the bad.

## What I learned the hard way

**First crack is your landmark.** Around 196°C, the beans release steam in an audible first crack — like popcorn, spread across a minute or two. This marks the beginning of light roast territory. Pull before this and the cup will taste grassy and underdeveloped.

**Airflow matters as much as heat.** Chaff from the beans needs somewhere to go. Poor airflow means smoke taints the cup. I learned this by ruining several batches before I understood why.

**Rest your coffee.** Freshly roasted coffee is surprisingly bad. For the first 24–48 hours, CO₂ outgassing interferes with extraction. The sweet spot for most roasts is 4–10 days post-roast. Patience is part of the recipe.

## The advantage of place

I live a few kilometres from estates that grow some of India's best arabica. That means I can buy green beans at origin prices and experiment with varieties that don't make it into commercial export — small lots, unusual processing experiments.

Last month I roasted a honey-processed Kaveri variety from a tiny estate near Kemmangundi. The resulting cup had strawberry and brown sugar notes I've never found in anything commercially available.

That cup felt like the point of all of it.

— Nesara
`,
  },
  {
    slug: 'building-with-earth',
    title: 'What building with mud taught me',
    date: '2026-02-05',
    excerpt: 'Patience, material intelligence, and why the old ways have engineering inside them.',
    tags: ['building', 'mud', 'craft', 'life'],
    content: `# What building with mud taught me

The first mud wall I ever built cracked.

I'd done the research. I'd done the jar test — fill a jar with soil and water, shake, let it settle for 24 hours, and read the layers to understand your clay-to-sand ratio. My soil had a good ratio. I mixed in rice husk for fiber. I added lime for stability. And then I built too fast, in the afternoon heat, on a section without enough shade.

The wall dried unevenly and cracked from the inside out. I knocked it down and started again.

## What the material teaches you

Every building material has a logic. Steel wants to be in tension. Concrete wants compression. Wood has grain, and the grain has an opinion about how forces should flow through it.

Mud is more demanding than most. It needs moisture to be workable, but moisture is also its enemy once it's built. It needs time: you can only build a foot or two of height per day before the lower sections must cure. It responds to humidity and temperature in ways you have to feel rather than calculate.

This is uncomfortable for programmers. We're used to systems where the same input reliably produces the same output. Mud is not like that. Two bags of soil from the same field can behave differently depending on when they were dug, what the weather has been, how long they sat.

You have to read the material, not just follow the recipe.

## What it has in common with software

After several months of mud building, I became a better programmer.

I started reading my codebase the way I read soil — looking for the actual properties of the thing in front of me, not the properties I assumed it had. I started noticing when I was moving too fast out of impatience rather than because the work was ready.

Both crafts punish wishful thinking. In mud, wishful thinking cracks. In code, it ships bugs.

Both reward understanding the material deeply before trying to impose your design on it. In mud, that means knowing your soil's shrinkage rate. In code, it means understanding how your framework actually handles state.

## The old ways have engineering inside them

The earthen houses in Chikmaglur that are a hundred years old still stand. They breathe with the humidity. They stay cool in ways that concrete blocks cannot match. They were built by people who didn't have materials science degrees but understood their materials by feel and long experience.

That's a kind of intelligence I want to stay in contact with.

The new wall, built slowly, is still standing. No cracks.

— Nesara
`,
  },
];

posts.sort((a, b) => (a.date < b.date ? 1 : -1));

export default posts;
