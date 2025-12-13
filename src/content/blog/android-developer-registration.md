---
title: Android Developer Registration
date: 2025-10-03
draft: true
---

In stark contrast to Apple's walled garden after iPhone release in 2007, shortly after Android started off as an open system. Open source helped establish trust for OEMs (samsung, amazon, chinese stores) and on the user side as well, including the ability to "sideload" applications after introducing Play Store (then Android Market in 2008). negative connotation is Psychological framing? .

As we know too well, open networks are adversarial environments. Compared to iOS, the Android ecosystem had a sizeable issue with malware, in 2017 they introduced Google Play Protect which is a layer that regularly checks apps for harmful behavior.

On the user side, since most use Google Play Store, they are tied to their Google account - in turn linked to a phone number which in most cases is registered with the government.

In 2021, while we were all distracted with the virus, Google kept tightening the screws: introducing mandatory government IDs for developers publishing in the Play Store, and the Integrity API which is used by application developers to verify app has not been tampared with and detect their environment, for instance refusing to execute if the app was *sideloaded* from "unofficial" sources or runs on a superior operating system like GrapheneOS.

Not enough with that, Google has introduced the [Android developer verification](https://developer.android.com/developer-verification/guides) program set to go in full motion in 2026, claiming:

The creative minds at Google trying to justify: "protection against the bad guys" is never enough, 

> "Android's developer verification adds a layer of security. This protects users by deterring bad actors and making it harder for them to spread harm."

Your apps will be blocked If you do not verify your identity and register, which includes submitting to Google's Privacy Policy (they promise "committed to protecting your data" so don't worry) and a registration fee of 25 USD [only payable by card](https://support.google.com/googleplay/android-developer/answer/9875040?hl=en).

At the moment there are two workarounds: registering for a "Limited Distribution" developer account without requiring a government ID but can be installed in a "limited amount of devices" or directly via `adb` which requires transferring apps via a computer. The incoming App ID squatting will be something interesting to watch.

Even without showing an ID, a phone number and a bank card are enough.

It's all about "keeping you safe", right?

### the kyc trap, ignorance or malicious?

KYC could have been designed by Lloyd Christmas. It is ineffective, immoral, expensive and stupid. It is an artificial barrier trying to weed out bad actors and instead is an annoyance an a danger for millions of law-abiding citizens (physical attacks, impersonation, identity theft). As bad actors have financial incentives, avoiding the barrier is trivial: they use mules, offshore companies, buy stolen IDs, bribe officials. 

In international finance, per official figures [less than 0.1% of the proceeds of crime are seized](https://theconversation.com/the-global-war-on-money-laundering-is-a-failed-experiment-125143). Even drug lords admit how effective this is, when they can keep 99.95% of their gross income. [Weaponization of FATF to repress](https://www.therage.co/weaponization-of-fatf-standards-rusi/).and [painting anonymity as a crime](https://www.therage.co/samourai-wallet-new-indictment/)

And of course, you will leave your government ID safe with Google, right? This past August, right after announcing compulsory KYC, [Google got hacked asking 2.5B users to change their passwords](https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift). You can't make this shit up. Created massive honeypots that hackers, insiders, and state actors seek to exploit.

### defining malware

The other point of centralization is "who defines malware". Google itself is a parasitic entreprise, so perhaps we don't align with the definition?

As Marc Prud recently said about Google Play Store and others.

> they are hotbeds of spyware and scams, blatantly promoting apps that prey on their users through attempts to monetize their attention and mine their intimate information through any means necessary, including trickery and dark patterns.

Malware is a strawman, common sense protections are in place, it's just an excuse to expand surveillance. 

Following the trend, restrictions only increased in the Android platform since its inception. Given Google's reputation at this point, it can be reasonably expected that apps *will be turned off*. 

Instead of working with alternative stores like F-Droid, Accrescent or Zapstore, pushing down the soluition to the wider market and giving users choice when it comes to dealing with the malware problem, they act eerily similar to governments for which the solution to every problem is more centralized top-down control. If the playbook is incompetence or malice, I'm not sure.

Following the [latest F-Droid post](https://f-droid.org/en/2025/09/29/google-developer-registration-decree.html), they call to lawmakers. Won't keep my hopes up, DMA is a _ by the Brussels clowns (Chrome Web Store), the same bureucrats that are trying to push ChatControl. Just how convenient having  ; apple alternative marketplace in EU bullshit. Its effectively a duopoly covering % of the market globally. Both are converging to this  "strictly necessary and proportionate" idea (hacker news) and only in the EU which accounts for % of the global population.

Enforcement starts in September 2026 in Brazil, Indonesia, Singapore, and Thailand but will roll out worldwide in 2027. 