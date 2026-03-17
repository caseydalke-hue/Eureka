import { useEffect, useMemo, useRef, useState } from "react";
// Simple local UI components (removes dependency on shadcn so the app can run in any React/Vite project)
const Button = ({ children, onClick, className = "", variant, ...props }: any) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg text-sm border border-neutral-300 bg-white hover:bg-neutral-100 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white border border-neutral-200 rounded-2xl ${className}`}>{children}</div>
);

const CardHeader = ({ children }: any) => (
  <div className="px-5 pt-5 pb-2 border-b border-neutral-200">{children}</div>
);

const CardTitle = ({ children, className = "" }: any) => (
  <div className={`font-semibold text-lg ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

const Slider = ({ min, max, step, value, onValueChange }: any) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value?.[0] ?? 0}
    onChange={(e) => onValueChange?.([Number(e.target.value)])}
    className="w-full"
  />
);

import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Monitor,
  Maximize,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: number;
  name: string;
  text: string;
  type?: "text" | "reaction";
};

const knownNames = [
  "Lena Birnbaum-Gerstein",
  "Darrel Creighton-Bolano",
  "Erin Catlett-Harris",
  "Mikeala Morse-Turner",
  "Taylor Aberra-Harris",
  "Alandra Garcia-Hunt",
  "Rivka Rasmussen",
  "Melanie Alexander",
  "Josephine Lawrence",
  "Christian Burns",
  "Christain Burns",
  "Sandra Blaise",
  "Karen Stacin",
  "Karen Sapp",
  "Leslie Kaufman",
  "Bryan Serulnak",
  "Bryan Serulnek",
  "Guita Lakhani",
  "Delia Perez",
  "Myla Townes",
  "Tyler Coppins",
  "Arnold Filmore",
  "Marla Nonner",
  "Tonya Wallace",
  "Svetlana Givental",
  "Orson Mankel",
  "Dara Konrad",
  "Sarah Howell",
  "Pila Baum",
  "Sandy Washington",
  "Deborah Roth",
  "Darla Campese",
  "Terry Nguyen",
  "Franny Richards",
  "Courtney Riley",
  "Reid Nuzzi",
  "Jamila Hayes",
  "Kate Pacyniak",
  "Doug Wong",
  "Francis Alvarez",
  "Carlos Banyon",
  "Paula Moody",
  "Tonya Qun",
];

const parseChatLine = (line: string, id: number): Message => {
  const trimmed = line.trim();
  const matchedName = knownNames.find((name) => trimmed.startsWith(`${name} `) || trimmed === name);

  if (matchedName) {
    const text = trimmed.slice(matchedName.length).trim();
    return {
      id,
      name: matchedName,
      text,
      type: text === "👍" || text === "😮" ? "reaction" : "text",
    };
  }

  const parts = trimmed.split(" ");
  const name = parts.slice(0, 2).join(" ");
  const text = parts.slice(2).join(" ");

  return {
    id,
    name,
    text,
    type: text === "👍" || text === "😮" ? "reaction" : "text",
  };
};

const defaultChat = `Karen Sapp We can hear you now Don.
Leslie Kaufman 👍
Bryan Serulnak Any update on when school’s reopening?
Guita Lakhani I think that’s what they’re about to tell us.
Mikeala Morse-Turner Is Hallie not on the board anymore?
Delia Perez They moved to Vancouver.
Leslie Kaufman 👍
Myla Townes I’m pretty sure it was Montreal.
Delia Perez Actually we visited them in Vancouver over the summer. So I think I’d know!
Delia Perez They’re really happy there!
Leslie Kaufman 👍
Taylor Aberra-Harris Is this a recording or is this live?
Tyler Coppins It’s live. Hence the term, “LIVE STREAM!”
Arnold Filmore In fairness, you CAN watch recordings of old ones.
Marla Nonner Chris and I and the kids are all watching!!!
Tonya Wallace Samara and Tom aren’t able to watch but they wanted me to say they wish they could.
Svetlana Givental I can see the video but still can’t hear. Can anyone else hear?
Orson Mankel Svetlana, you might have it muted. Click the little speaker icon on bottom right.
Svetlana Givental Thank you Orson!
Dara Konrad Oh Suzanne!
Leslie Kaufman 👍
Sarah Howell Hi Everybody:)
Pila Baum WHOA
Sandy Washington Some of those might be false positives.
Sarah Howell symptoms include fever, headache, muscle aches, fatigue, loss of appetite, pain while chewing or swallowing and swollen salivary glands.
Sarah Howell If you think your child has any of these symptoms please contact your doctor IMMEDIATELY.
Deborah Roth Is it okay to take Tylenol for fever?
Sarah Howell Tylenol or Ibuprofen is fine. Just not aspirin.
Darla Campese I’d also suggest ginger or turmeric? I find they work better than Tylenol a lot of the time and NO chemicals.
Sarah Howell No harm in giving ginger, but we’re looking for the fever-reducing attributes of Tylenol. Can’t get that from an herbal remedy.
Darla Campese Actually that’s not true. Apple Cider Vinegar, Garlic, Raisin all good for reducing fever. This has been widely studied.
Terry Nguyen We’ve also been avoiding Processed Sugar and it made a big difference in the swelling.
Darla Campese Great suggestion Terry! Also natural nut butters (almond, pistachio) may help with the aches.
Leslie Kaufman 👍
Erin Catlett-Harris I made a giant batch of soup and can bring some to anyone who’s sick.
Christian Burns Wait. HALF the school is antivaxxers? Seriously????
Sandra Blaise “Anti-vaxxer” is not really a term I’m comfortable with. It’s actually something said out of IGNORANCE.
Christian Burns Oh well then Sandra, enlighten away!
Sandra Blaise It’s easy to call someone crazy if you’ve never walked a mile in their shoes.
Sandra Blaise I wake up every single morning wishing I could go back to being that carefree dairy and sugar-eating person I was 15 years ago.
Sandra Blaise But I can’t.
Karen Sapp Exactly! Protect your children by EDUCATING YOURSELVES.
Tyler Coppins OR, Protect your children by VACCINATING THEM.
Terry Nguyen Gotta trust your parental instincts. If it feels wrong, it IS wrong.
Sandra Blaise And we wonder about the rise in autism, learning differences, allergies etc.
Tyler Coppins Thanks for the perspective, Patient Zero!
Franny Richards Not true. She wasn’t the first. Get your facts straight!!!
Bryan Serulnek Is it fair to have school open if half the kids can’t be there? We ALL pay tuition.
Lena Birnbaum-Gerstein Maybe staying open for only ONE category of kids is a form of discrimination?
Alandra Garcia-Hunt Yes. Far more equitable to just keep it closed for everyone right now.
Terry Nguyen And then we could add on some Saturdays when we come back?
Sandra Blaise Or longer school hours?
Lena Birnbaum-Gerstein Maybe skip spring break?
Courtney Riley Wait what???? Why should we be forced to keep our kids home because you CHOOSE to endanger yours?
Darla Campese Actually Courtney, we’re CHOOSING to keep our kids safe
Deborah Roth Maybe we could use some tuition money for a day-camp these weeks?
Erin Catlett-Harris Great idea! And also use some for in-home tutoring?
Darrel Creighton-Bolano I’d be happy to lead morning yoga sessions.
Christain Burns Wait. Why would WE pay for YOUR private tutoring?
Erin Catlett-Harris It’s in EVERYONE’s interest that we don’t have half the school falling behind.
Reid Nuzzi WHAT????
Jamila Hayes DON! How can you make such a HUGE UNILATERAL decision without our input????
Alandra Garcia-Hunt That is NOT how we operate!!!!
Tyler Coppins CANNOT BELIEVE we are even having this conversation!
Kate Pacyniak Typical behavior from the Executive Committee of FASCISM.
Leslie Kaufman 👍
Doug Wong Okay here’s another idea: what if we made the quarantine days OPTIONAL.
Orson Mankel Doug, that’s idiotic. If the “problem” is that we won’t have enough kids in class, why make the problem worse???
Rivka Rasmussen Orson Mankel, please do not call another member of our community an “idiot.”. We’re all just trying to figure this out.
Orson Mankel I said the IDEA was idiotic, not him.
Orson Mankel Which it is.
Orson Mankel But I APOLOGIZE if you misinterpreted.
Melanie Alexander Great analogy Suzanne!! It WOULD be just like closing for the Jewish Holidays.
Leslie Kaufman 👍
Francis Alvarez Um, sorry. Religion ≠ vaccine denial
Josephine Lawrence Actually Francis, sometimes vaccine refusal does = religion.
Josephine Lawrence Who are you to question my religious beliefs???
Francis Alvarez Ignorance is your religion, Josephine?
Sandra Blaise Doesn’t it all come down to faith?
Sandra Blaise Do you have faith that our bodies were built to handle these kind of pathogens?
Sandra Blaise Or faith in Big Pharma?
Darrel Creighton-Bolano As a chiropractor, I’ve seen all sorts of terrible things from Mainstream Medicine
Myla Townes Sorry, chiropractors are not doctors.
Darla Campese Actually chiropractors have way more hours of schooling in anatomy than Western Doctors.
Myla Townes My dog has way more hours in sniffing shit than Western Doctors, that doesn’t make him a Proctologist.
Orson Mankel You want to play Russian roulette with your kids, go for it. But when you bring Little Miss Typhoid Mary to school, you put all our children at risk.
Delia Perez You’re a disgusting human, Orson Mankel
Myla Townes What’s truly disgusting is endangering others people’s children over your pseudo-scientific bullshit.
Carlos Banyon Let’s all take it down a notch guys.
Josephine Lawrence Not a guy, sorry.
Tonya Wallace Maybe let’s all try just closing our eyes and listening?
Leslie Kaufman 👍
Dara Konrad Heidegger has a great treatise on this concept. Link: www.nccu.edu/1079/heid_sch.pdf
Dara Konrad It’s a pretty easy read, as far as Heidegger goes.
Sandy Washington The Delayed Schedule makes so much sense. Not anti-vaccine, just maybe we give TOO MANY at once.
Sarah Howell Medically there’s NO benefit in delaying vaccines or spreading them out.
Franny Richards NOT TRUE! Babies immune systems are too fragile to handle 14 viruses.
Arnold Filmore The “mainstream” medical literature is ALL funded by Big Pharma.
Leslie Kaufman 👍
Darla Campese There’s a community in China where the entire population was forcibly vaccinated and they still had a massive outbreak of Rubella.
Erin Catlett-Harris We went to Beijing last summer and could hardly breathe!
Sandra Blaise There’s SO MUCH corruption in Chinese Pharma!!!!
Arnold Filmore Just answer honestly: would you rather have measles or autism?
Orson Mankel Just answer honestly: were you dropped on your head as a child?
Christian Burns TRUE FACTS: Moonlanding wasn’t faked 9/11 wasn’t an inside job Global Warming is real Vaccines Don’t Cause Autism
Karen Stacin Mock all you want, but I saw so many bad things as a nurse.
Karen Stacin That’s why I decided I would NEVER subject my children to Western Medicine of any kind.
Reid Nuzzi Did you just say you’d NEVER TAKEN YOUR CHILD TO A DOCTOR???????
Karen Stacin The best thing I can do for them is leave their bodies PURE.
Tonya Qun That’s child abuse!!!
Leslie Kaufman 👍
Karen Stacin When they are adults they can make their own choices about their bodies.
Carlos Banyon I’m sorry. As a therapist, I have an ethical obligation to report any at-risk children.
Carlos Banyon I now have to call CHILD PROTECTIVE SERVICES.
Paula Moody THAT was not called for. Don’t be such a fucking asshole.
Josephine Lawrence Breaking News: Human Beings survived MILLIONS of years before Western Medicine.
Myla Townes And half of all women died in childbirth!
Darla Campese Wake up!!! The answer is not to get another dose of a failed vaccine.
Christian Burns Remember that time I got crippled from polio? Oh, no wait. I didn’t. Cause I got FUCKING VACCINATED.
Lena Birnbaum-Gerstein Your complacency in the destruction of children’s lives is disgusting.
Tyler Coppins What do stupid people and dead people have in common? The dead people don't know they’re dead either!
Francis Alvarez maybe
Pila Baum Sorry but refusing to acknowledge vaccine injury is like the GERMANS circa 1944 claiming that they had no knowledge of the concentration camps.
Tyler Coppins Ding ding ding! We have a winner! First Nazi reference.
Josephine Lawrence Fuck your cynicism asshole. We’re talking about our children’s lives.
Lena Birnbaum-Gerstein Have fun on your Pied Piper Death Marches. My kids are not joining the parade.
Orson Mankel If my newborn gets mumps, I’m gonna sue you all into your graves.
Arnold Filmore Orson, Are you threatening me?
Guita Lakhani We’re all threatened by your LUNATIC ANTI-SCIENCE DEATH CULT
Josephine Lawrence Do what you want, just keep your POISON off my kids.
Christian Burns The only POISON is what’s coming out of your TRASH MOUTH
Darrel Creighton-Bolano Big Pharma is the REAL death cult
Darrel Creighton-Bolano When the revolution comes they’ll be first against the wall
Francis Alvarez You’re a bunch of fucking lunatics
Orson Mankel I can’t believe my kid goes to school with people whose parents are THIS DUCKING STUPID.
Orson Mankel *Fucking
Lena Birnbaum-Gerstein It’s no wonder no one wants to play with your kids Orson. Apple=Tree
Myla Townes Let’s just expose all the anti-vaxxers to these “mild” diseases. We’d solve overpopulation!
Arnold Filmore “Solve overpopulation”? Wow.
Myla Townes Natural Selection.
Myla Townes Or don’t you believe in that either?
Arnold Filmore You’re an ignorant cunt
Leslie Kaufman 😮`;

const seedMessages = defaultChat
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line, index) => parseChatLine(line, index + 1));

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function getAvatarStyle(profileColor: string) {
  return {
    backgroundColor: profileColor,
    color: "#111827",
    border: "1px solid rgba(0,0,0,0.18)",
  };
}

function getAvatarSrc(name: string) {
  const formatted = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `/avatars/${formatted}.jpg`;
}

export default function EurekaDayChatSimulator() {
  const [messages] = useState<Message[]>(seedMessages);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [baseDelay, setBaseDelay] = useState(850);

  const [maxOnScreen, setMaxOnScreen] = useState(8);
  const [isFastMode, setIsFastMode] = useState(false);
  const [fastDelay, setFastDelay] = useState(180);
  const [bubbleColor, setBubbleColor] = useState("#f5f5f5");
  const [profileColor, setProfileColor] = useState("#93c5fd");
  const [bubbleTextColor, setBubbleTextColor] = useState("#1f2937");
  const [isBubbleTextBold, setIsBubbleTextBold] = useState(false);
  const [chatFontSize, setChatFontSize] = useState(15);
  const [nameFontSize, setNameFontSize] = useState(12);
  const [chatHeightScale, setChatHeightScale] = useState(1);
  const [messageScale, setMessageScale] = useState(1);
  const [chatWidth, setChatWidth] = useState(820);
  const [isProjectionMode, setIsProjectionMode] = useState(false);
  const [projectionNotice, setProjectionNotice] = useState("");

  const [isMuted, setIsMuted] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.45);

  const timerRef = useRef<number | null>(null);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);
  const dingRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);
  const lastPlayedVisibleCountRef = useRef(0);

  // Spacebar = Next Message (QLab-style operator advance)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        hasInteractedRef.current = true;
        setIsPlaying(false);
        setVisibleCount((count) => Math.min(count + 1, messages.length));
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [messages.length]);

  // Unlock audio after first user interaction
  useEffect(() => {
    const markInteracted = () => {
      hasInteractedRef.current = true;
    };

    window.addEventListener("pointerdown", markInteracted);
    window.addEventListener("keydown", markInteracted);

    return () => {
      window.removeEventListener("pointerdown", markInteracted);
      window.removeEventListener("keydown", markInteracted);
    };
  }, []);

  const visibleMessages = useMemo(
    () => messages.slice(Math.max(0, visibleCount - maxOnScreen), visibleCount),
    [messages, visibleCount, maxOnScreen]
  );

  const playDing = () => {
    const audio = dingRef.current;
    if (!audio || isMuted || soundVolume <= 0) return;
    if (!hasInteractedRef.current) return;

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = soundVolume;
      void audio.play();
    } catch {
      // ignore browser playback failures
    }
  };

  // Play sound whenever a new message becomes visible
  useEffect(() => {
    if (visibleCount > lastPlayedVisibleCountRef.current) {
      playDing();
    }
    lastPlayedVisibleCountRef.current = visibleCount;
  }, [visibleCount, isMuted, soundVolume]);

  const scheduleNext = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    if ((!isPlaying && !isFastMode) || visibleCount >= messages.length) return;

    const delay = isFastMode ? fastDelay : baseDelay + Math.floor(Math.random() * 180);

    timerRef.current = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + 1, messages.length));
    }, delay);
  };

  useEffect(() => {
    scheduleNext();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isPlaying, isFastMode, visibleCount, messages, baseDelay, fastDelay]);

  useEffect(() => {
    if (visibleCount >= messages.length) setIsPlaying(false);
  }, [visibleCount, messages.length]);

  const toggleFastMode = () => {
    hasInteractedRef.current = true;
    setIsPlaying(false);
    setIsFastMode((f) => !f);
  };

  const toggleProjectionMode = () => {
    hasInteractedRef.current = true;
    setIsProjectionMode((p) => !p);
  };

  const openFullscreenChat = async () => {
    if (!chatWindowRef.current) return;

    if (!document.fullscreenEnabled) {
      setProjectionNotice(
        "Fullscreen is blocked in this preview. It should work in a normal browser tab on your own site."
      );
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setProjectionNotice("");
      } else {
        await chatWindowRef.current.requestFullscreen();
        setProjectionNotice("");
      }
    } catch (error) {
      setProjectionNotice(
        "Fullscreen is blocked in this preview. It should work in a normal browser tab on your own site."
      );
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <audio ref={dingRef} src="/sounds/ding.mp3" preload="auto" />

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="rounded-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Eureka Day Chat Simulator</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  hasInteractedRef.current = true;
                  setIsPlaying((p) => !p);
                }}
                className="rounded-2xl"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Play
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  hasInteractedRef.current = true;
                  setIsPlaying(false);
                  setVisibleCount((count) => Math.min(count + 1, messages.length));
                }}
                className="rounded-2xl"
              >
                <SkipForward className="mr-2 h-4 w-4" /> Next Message
              </Button>

              <Button
                variant={isFastMode ? "default" : "outline"}
                onClick={toggleFastMode}
                className="rounded-2xl"
              >
                {isFastMode ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Stop Fast
                  </>
                ) : (
                  <>
                    <SkipForward className="mr-2 h-4 w-4" /> Fast Mode
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  hasInteractedRef.current = true;
                  setIsPlaying(false);
                  setVisibleCount(0);
                  lastPlayedVisibleCountRef.current = 0;
                }}
                className="rounded-2xl"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>

              <Button
                variant={isProjectionMode ? "default" : "outline"}
                onClick={toggleProjectionMode}
                className="rounded-2xl"
              >
                <Monitor className="mr-2 h-4 w-4" />{" "}
                {isProjectionMode ? "Exit Projection" : "Projection Mode"}
              </Button>

              <Button
                variant="outline"
                onClick={openFullscreenChat}
                className="rounded-2xl"
              >
                <Maximize className="mr-2 h-4 w-4" /> Fullscreen Chat
              </Button>
            </div>

            {projectionNotice && (
              <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {projectionNotice}
              </div>
            )}

            <div className="space-y-3">
              <div className="text-sm font-medium">Message Delay: {baseDelay} ms</div>
              <Slider
                min={200}
                max={2000}
                step={50}
                value={[baseDelay]}
                onValueChange={(v: number[]) => setBaseDelay(v[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Fast Mode Speed: {fastDelay} ms</div>
              <Slider
                min={50}
                max={500}
                step={10}
                value={[fastDelay]}
                onValueChange={(v: number[]) => setFastDelay(v[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">
                  Message Sound Volume: {Math.round(soundVolume * 100)}%
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    hasInteractedRef.current = true;
                    setIsMuted((m) => !m);
                  }}
                  className="rounded-2xl"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="mr-2 h-4 w-4" /> Muted
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" /> Sound On
                    </>
                  )}
                </Button>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.05}
                value={[soundVolume]}
                onValueChange={(v: number[]) => {
                  hasInteractedRef.current = true;
                  setSoundVolume(v[0]);
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Chat Width: {chatWidth}px</div>
              <Slider
                min={500}
                max={1400}
                step={10}
                value={[chatWidth]}
                onValueChange={(v: number[]) => setChatWidth(v[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">
                Chat Height Scale: {chatHeightScale.toFixed(2)}x
              </div>
              <Slider
                min={0.6}
                max={2}
                step={0.05}
                value={[chatHeightScale]}
                onValueChange={(v: number[]) => setChatHeightScale(v[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Message Scale: {messageScale.toFixed(2)}x</div>
              <Slider
                min={0.7}
                max={2}
                step={0.05}
                value={[messageScale]}
                onValueChange={(v: number[]) => setMessageScale(v[0])}
              />
            </div>

            <div className="flex flex-wrap items-start gap-6">
              <div className="space-y-2">
                <div className="text-sm font-medium">Chat Bubble Color</div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bubbleColor}
                    onChange={(e) => setBubbleColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer border border-neutral-300 bg-transparent p-1"
                  />
                  <div className="text-sm text-neutral-600">{bubbleColor}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Chat Bubble Text Color</div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bubbleTextColor}
                    onChange={(e) => setBubbleTextColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer border border-neutral-300 bg-transparent p-1"
                  />
                  <div className="text-sm text-neutral-600">{bubbleTextColor}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Profile Color (fallback)</div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={profileColor}
                    onChange={(e) => setProfileColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer border border-neutral-300 bg-transparent p-1"
                  />
                  <div className="text-sm text-neutral-600">{profileColor}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={isBubbleTextBold}
                  onChange={(e) => setIsBubbleTextBold(e.target.checked)}
                  className="h-4 w-4"
                />
                Bold Chat Text
              </label>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Chat Font Size: {chatFontSize}px</div>
              <Slider
                min={12}
                max={32}
                step={1}
                value={[chatFontSize]}
                onValueChange={(v: number[]) => setChatFontSize(v[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Name Font Size: {nameFontSize}px</div>
              <Slider
                min={10}
                max={28}
                step={1}
                value={[nameFontSize]}
                onValueChange={(v: number[]) => setNameFontSize(v[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Max Messages On Screen: {maxOnScreen}</div>
              <Slider
                min={3}
                max={12}
                step={1}
                value={[maxOnScreen]}
                onValueChange={(v: number[]) => setMaxOnScreen(v[0])}
              />
            </div>
          </CardContent>
        </Card>

        <div
          ref={chatWindowRef}
          className={
            isProjectionMode
              ? "bg-black min-h-screen w-full flex items-center justify-center overflow-hidden"
              : "bg-[#f5f7fb] p-5 shadow-xl ring-1 ring-black/5 flex items-center justify-center overflow-hidden"
          }
        >
          <div
            className="flex w-full items-center justify-center overflow-hidden"
            style={{
              minHeight: isProjectionMode ? "100vh" : "45vh",
              padding: isProjectionMode ? "2vh 2vw" : "0",
              boxSizing: "border-box",
            }}
          >
            <div
              className="flex flex-col overflow-hidden border border-neutral-800 bg-black shadow-2xl"
              style={{
                width: `min(${chatWidth}px, 96vw)`,
                height: isProjectionMode
                  ? `min(${780 * chatHeightScale}px, 94vh)`
                  : `min(${420 * chatHeightScale}px, 45vh)`,
                maxWidth: "96vw",
                maxHeight: isProjectionMode ? "94vh" : "45vh",
              }}
            >
              <div className={`flex-1 overflow-hidden bg-black ${isProjectionMode ? "px-6 py-6" : "px-5 py-5"}`}>
                <div
                  className="flex h-full flex-col justify-end"
                  style={{ gap: `${12 * messageScale}px` }}
                >
                  <AnimatePresence initial={false}>
                    {visibleMessages.map((message) => (
                      <motion.div
                        layout
                        key={message.id}
                        initial={{ opacity: 0, y: 28, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                          layout: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                        }}
                        className="flex items-start"
                        style={{ gap: `${12 * messageScale}px` }}
                      >
                        <div
                          className="shrink-0 rounded-full overflow-hidden flex items-center justify-center"
                          style={{
                            width: `${40 * messageScale}px`,
                            height: `${40 * messageScale}px`,
                            border: "1px solid rgba(0,0,0,0.18)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                            backgroundColor: profileColor,
                          }}
                        >
                          <img
                            src={getAvatarSrc(message.name)}
                            alt={message.name}
                            className="h-full w-full object-cover"
                            draggable={false}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                              const fallback = target.nextElementSibling as HTMLElement | null;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />

                          <div
                            style={{
                              ...getAvatarStyle(profileColor),
                              width: "100%",
                              height: "100%",
                              display: "none",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: `${12 * messageScale}px`,
                              fontWeight: "bold",
                            }}
                          >
                            {getInitials(message.name)}
                          </div>
                        </div>

                        <div
                          className="min-w-0 max-w-[78%] shadow-sm ring-1 ring-black/5"
                          style={{
                            backgroundColor: bubbleColor,
                            borderRadius: `${24 * messageScale}px`,
                            paddingLeft: `${16 * messageScale}px`,
                            paddingRight: `${16 * messageScale}px`,
                            paddingTop: `${12 * messageScale}px`,
                            paddingBottom: `${12 * messageScale}px`,
                          }}
                        >
                          <div
                            className="font-semibold leading-tight"
                            style={{
                              color: bubbleTextColor,
                              fontSize: `${nameFontSize * messageScale}px`,
                              marginBottom: `${4 * messageScale}px`,
                            }}
                          >
                            {message.name}
                          </div>

                          <div
                            className="leading-snug"
                            style={{
                              color: bubbleTextColor,
                              fontWeight: isBubbleTextBold ? 700 : 400,
                              fontSize: `${
                                (message.type === "reaction" ? chatFontSize * 1.5 : chatFontSize) *
                                messageScale
                              }px`,
                              lineHeight: message.type === "reaction" ? 1 : 1.35,
                            }}
                          >
                            {message.text}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border-t border-neutral-800 bg-black px-5 py-3 text-sm text-neutral-400">
                Showing {visibleCount} of {messages.length} messages
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}