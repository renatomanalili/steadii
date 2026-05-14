export type Tip = {
  id: number;
  title: string;
  body: string;
};

export const tips: Tip[] = [
  {
    id: 1,
    title: "Best time to measure",
    body: "Take your BP at the same time each day for the most accurate trend tracking. Morning readings before coffee or medication are ideal.",
  },
  {
    id: 2,
    title: "Sit correctly",
    body: "Sit with your back supported, feet flat on the floor, and arm at heart level. Incorrect posture can add 10 points to your reading.",
  },
  {
    id: 3,
    title: "Rest before measuring",
    body: "Sit quietly for 5 minutes before taking a reading. Physical activity, stress, or rushing can temporarily raise your BP.",
  },
  {
    id: 4,
    title: "Avoid caffeine beforehand",
    body: "Caffeine can raise BP for up to 3 hours. Try to avoid coffee, tea, or energy drinks 30 minutes before measuring.",
  },
  {
    id: 5,
    title: "Take two readings",
    body: "Take two readings 1 minute apart and record the average. Single readings can be misleading due to temporary spikes.",
  },
  {
    id: 6,
    title: "Empty bladder first",
    body: "A full bladder can raise your BP reading by up to 15 points. Use the bathroom before measuring for more accurate results.",
  },
  {
    id: 7,
    title: "Watch your sodium",
    body: "High sodium intake is one of the biggest contributors to high BP. Aim for less than 2,300mg per day — about one teaspoon of salt.",
  },
  {
    id: 8,
    title: "Stay hydrated",
    body: "Dehydration causes your blood to thicken, making your heart work harder. Drink at least 8 glasses of water daily.",
  },
  {
    id: 9,
    title: "Move every day",
    body: "Just 30 minutes of moderate walking daily can lower BP by 5–8 mmHg over time. Consistency matters more than intensity.",
  },
  {
    id: 10,
    title: "Limit alcohol",
    body: "Drinking more than one drink per day for women or two for men can raise BP over time. Moderation makes a measurable difference.",
  },
  {
    id: 11,
    title: "Quit smoking",
    body: "Each cigarette temporarily raises BP for several minutes. Long-term smoking damages blood vessel walls and raises baseline BP.",
  },
  {
    id: 12,
    title: "Manage stress",
    body: "Chronic stress keeps your body in a constant fight-or-flight state. Deep breathing, meditation, or even a short walk can help.",
  },
  {
    id: 13,
    title: "Sleep matters",
    body: "Poor sleep is directly linked to higher BP. Aim for 7–9 hours per night and try to keep a consistent sleep schedule.",
  },
  {
    id: 14,
    title: "Know your numbers",
    body: "Normal BP is below 120/80 mmHg. Knowing your personal baseline helps you and your doctor spot meaningful changes early.",
  },
  {
    id: 15,
    title: "Potassium helps",
    body: "Potassium helps balance sodium levels in your body. Bananas, sweet potatoes, spinach, and avocados are great sources.",
  },
  {
    id: 16,
    title: "Log both readings",
    body: "Logging AM and PM readings gives your doctor a complete picture. BP naturally varies throughout the day.",
  },
  {
    id: 17,
    title: "Cuff position matters",
    body: "Place the cuff on bare skin, not over clothing. The cuff should sit about 2cm above your elbow crease.",
  },
  {
    id: 18,
    title: "Do not talk while measuring",
    body: "Talking during a BP reading can raise the result by up to 17 mmHg. Stay still and silent until the reading is complete.",
  },
  {
    id: 19,
    title: "White coat effect",
    body: "Some people have higher BP at the doctor's office due to anxiety. Home monitoring gives a more accurate picture of your daily BP.",
  },
  {
    id: 20,
    title: "DASH diet",
    body: "The DASH diet — rich in fruits, vegetables, whole grains, and low-fat dairy — is clinically proven to lower BP by up to 11 mmHg.",
  },
  {
    id: 21,
    title: "Lose a little weight",
    body: "Even losing 5kg can lower BP significantly. Every kilogram of weight loss reduces BP by about 1 mmHg.",
  },
  {
    id: 22,
    title: "Check your medications",
    body: "Some medications like cold remedies, pain relievers, and birth control can raise BP. Ask your doctor if any of yours might be a factor.",
  },
  {
    id: 23,
    title: "Use the same arm",
    body: "Always measure on the same arm. BP can differ between arms by 10 mmHg or more — consistency gives you better trend data.",
  },
  {
    id: 24,
    title: "Morning vs evening",
    body: "BP is typically higher in the morning and lower at night. Tracking both helps identify patterns your doctor can act on.",
  },
  {
    id: 25,
    title: "Reduce processed food",
    body: "Processed and packaged foods are the biggest hidden source of sodium in most diets. Cooking at home gives you control.",
  },
  {
    id: 26,
    title: "Deep breathing works",
    body: "Six slow, deep breaths over 30 seconds can temporarily lower BP by several points. A useful technique before measuring.",
  },
  {
    id: 27,
    title: "Cold weather effect",
    body: "BP tends to rise in cold weather as blood vessels narrow to conserve heat. Be aware of seasonal patterns in your readings.",
  },
  {
    id: 28,
    title: "Consistency is everything",
    body: "A single reading means little. Consistent daily logging over weeks gives you and your doctor the data needed to make good decisions.",
  },
  {
    id: 29,
    title: "Share with your doctor",
    body: "Your logged readings are valuable. Use Steadii's doctor report to share a full summary at your next appointment.",
  },
  {
    id: 30,
    title: "Progress takes time",
    body: "Lifestyle changes take 4–12 weeks to show meaningful impact on BP. Trust the process and keep logging consistently.",
  },
];

export function getTipOfTheDay(): Tip {
  const dayOfYear = Math.floor(
    (Date.now() -
      new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return tips[dayOfYear % tips.length];
}
