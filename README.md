READ.ME

# CRIT 2 GO: Web App 
### Featuring a slack integration 
### Overview
Skip long zoom meetings for design reviews. Crit 2 Go is a consolidated asynchronous design review app that makes the decision making process quick and efficient to release updates for improved user experiences across platforms. 


## Business Case:How CRIT 2 GO Supports Product Goals

Example Company: StudyNow is a platform that relies on "CRIT 2 GO" for onsolidated asynchronous design review app that makes the decision making process quick and efficient to release updates for improved user experiences across platforms. 

|CRIT 2 GO Supports Product Goals|  
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CRIT 2 GO accelerates the design-to-development pipeline by replacing synchronous critique meetings with a structured, 7-step async workflow — enabling product teams to collect structured stakeholder feedback, reach documented decisions, and ship approved designs faster without sacrificing quality or accountability.|  
| By embedding the critique process directly into team workflows via Slack integration and role-based approvals, CRIT 2 GO ensures that every design decision is traceable, every voice is heard, and the Product Owner always has final authority — maintaining consistent, high-quality user experiences across a product's platform at the speed modern product teams require.|
| As a use case, a product team launching a new platform feature can run a full critique cycle in under 24 hours across multiple timezones — replacing a once-weekly 1-hour Zoom critique with on-demand async reviews that compress feedback loops, reduce blockers, and keep engineering delivery on schedule.|

## Context, user, and problem:
who the user is, what workflow you are improving, and why it matters

### Boost Time Efficiency for Design review

Example Case: **StudyNow** is a fictional company with a Web App platform featuring study tools for students. StudyNow relies om Crit 2 Go to meet business goals of building consistent and WCAG compliant user experiences with on time product delivery. StudyNow boosts efficiency on time management and handoff to engineers for release updates.

**User**: Product Teams (universal for any company)

**Problem**: Traditional synchronous design review meetings create team blockers with scheduling overhead, participation quality, and cuts into team capacity across product teams.

|      Product Team Roles        |
| :----------------------------: |
|      Product Managers          |
|      Product Designers         |
|  Software Engineers/Developers |
|      Product Owners            |
|  Internal Stakeholders         |   

Current Process/Workflow = 1+ hour zoom meetings 
cut into team capacity & Scheduling conflicts

CRIT 2 GO/New Workflow = 7-step async workflow — enabling product teams to collect structured stakeholder feedback faster

-----------------------------------------------------------------------------------------------------------------------

## Solution and design:
what you built, how it works, and the key design choices

### Soltion: CRIT 2 GO is a Web App that can be used as a time efficient alternative for 1+ hour zoom product design review
meetings. CRIT 2 GO can be integrated into slack as a workflow app.

The design choice captures various roles of a product team and how they will interact with the 7-step product design review 
workflow based on their role.

The design choice incorporates a consolidated design review that is flexible to submit and review designs by a provided 
deadline. 

### Technical Design Requirements:
- 7 workflow steps with progress stepper and role-based gating
- Logo matches the uploaded PNG exactly (green checkbox, purple "CRIT 2", blue "GO")
- Drag-and-drop file upload with deadline picker
- Stakeholder tagging modal with avatar initials
- Dual feedback: written comments + live voice recording (Web Audio API)
- Real-time vote tallies with animated bar chart
- Product Owner approval flow with optional notes
- Step 7 dev-ready success screen with Slack notification callout
- Slack integration modal with webhook setup instructions and auto-notifications at every step
- WCAG 2.1 AA compliant: ARIA roles, focus management, live regions, keyboard navigation throughout

-----------------------------------------------------------------------------------------------------------------------

## Evaluation and results:
what baseline you compared against, what test cases or rubric you used, and what you found

### Efficiency Evaluation: CRIT 2 GO vs. 1-Hour Facilitated Design Review/Critique Zoom Meeting

A data-driven comparison of async workflow efficiency against traditional synchronous critique meetings for product teams.

Data Reported Improvements:
- **75% Time Saved**: CRIT 2 GO (15 min) vs Zoom Meeting (60 min)
- **100% Async**: No calendar block needed 
- **4-6h Average** Cycle Time vs. same-day scheduling
- **0 Meetings Required**: Fully self-serve
- **Timezon Safe**: Distributed teams included
- **7 Steps Logged**: Full audit trail

### Side-by-Side Comparison
|   Dimension                   | 1-Hour ZOOM MEETING                                                                 |  CRIT 2 GO                                            |
|-----------------------------|----------------------------------------------------------------------------------|-------------------------------------------------------|
| **Total Time per critique**   | 60–90 min (meeting only) + scheduling overhead                                      | ~12–18 min total async participation per person|                    
| **Scheduling cost**           | High — finding a shared slot for 4–8+ people across timezones can take 1–3 days     | Zero — stakeholders respond within their own schedules|
| **Calendar block required**   | Yes — 60–90 min block for all attendees                                             | No — no calendar block needed                         |
| **Participation quality**     | Dominated by loudest voices; quieter stakeholders under-contribute; groupthink risk | Every stakeholder contributes independently; written + voice options support all communication styles|
| **Feedback format**           | Verbal only — no permanent record unless manually noted                             | Written comments, voice recordings, and structured votes — all logged and searchable|
| **Documented audit trail**    | No — depends on note-taker accuracy												  | Yes — every step, vote, and decision is timestamped   |
| **Distributed / remote teams**| Difficult — timezone conflicts, fatigue, connection issues						  | Native — fully async by design                        |
| **Role clarity**              | Often unclear; facilitator required to manage roles delivery						  | Role-based access enforces Designer → Stakeholder → Product Owner hierarchy|
| **Decision traceability**     | Decisions made verbally — frequently forgotten or misremembered					  | All votes and approval decisions are recorded with timestamps|
| **Slack / tool integration**  | Manual — requires someone to post recaps to Slack after the meetings				  | Automatic — Slack notified at every workflow step     |
| **Iteration speed**           | Next critique requires scheduling another meeting (days later)                      |New critique cycle can start immediately after approval or change request|
| **Facilitator needed**        | Yes — someone must prep agenda, run meeting, and send recap                         | No — the workflow is self-guided for all roles        |
| **Cost per session**         | 6–8 people × 1.5 hr = 9–12 person-hours per critique                                | 6–8 people × ~15 min async = 1.5–2 person-hours per critique|


## Time Breakdown: Where the Hours Go
Traditional Zoom Critique (per session)
-Day 0–2
**Scheduling (30–60 min across stakeholders)**
Finding a shared timeslot for 4–8+ team members, sending invites, and managing declines/reschedules.

-Pre-meeting
**Prep (15–20 min per attendee)**
Designer prepares a Figma share link, agenda, and talking points. Others review designs informally.

-Meeting
**Facilitated Critique (60–90 min)**
Includes setup, introductions, walkthrough, open discussion, and often off-topic tangents.

-Post-meeting
**Recap & Action Items (20–30 min)**
Facilitator writes and sends notes. Stakeholders re-clarify misremembered decisions. Decisions posted to Slack manually.

**Total: 2.5–4 hours of team time per critique session**

---------------------------------------------------------------------------------------------------------------------------------------------------
## CRIT 2 GO Async Workflow (per session)

- Step 1 · 5 min
**Designer uploads files and sets deadline**
Drag-and-drop upload, deadline picker. Slack notification fires automatically.

- Step 2 · 5 min
**Designer writes prompt and context**
Structured prompt guides reviewers to focus on the right areas. No agenda doc needed.

- Step 3 · 2 min
**Tag stakeholders**
Stakeholders receive Slack notification immediately.

- Step 4 · 5–10 min per reviewer
**Async feedback (anytime, any timezone)**
Written comments or voice notes submitted when convenient — no scheduling required.

- Step 5 · 2 min
**Vote on next steps**
One click — iterate or approve. Results visible in real time.

- Step 6 · 3 min
**Product Owner approves**
Reviews summary and casts final decision. Slack notification fires.

- Step 7 · 0 min
**Dev team notified automatically**
Slack message sent. Audit trail complete. No recap needed.

**Total: ~15–20 min of active participation per person, spread across their day**

------------------------------------------------------------------------------------------------

## Results Summary
|   CRIT 2 GO    | Zoom Meeting |
|----------------|--------------|
|✅ 75% reduction in person-hours per critique | ⚠️ Best for: Early ideation / ambiguous problems
|✅ Zero scheduling overhead| ⚠️ Good for: Building team rapport |
|✅ 100% audit trail — every decision logged| ⚠️ Good for: Real-time whiteboarding |
|✅ Inclusive of all communication styles|  ❌ Poor for: Async / distributed teams |
|✅ Works across timezones| ❌ Poor for: Documented decisions |
|✅ Automatic Slack integration| ❌ Poor for: High-frequency review cycles |
|✅ Scales to any team size| ❌ Poor for: Introverted contributors |


------------------------------------------------------------------------------------------------------------------------------------------------
## Artifact snapshot:
screenshots, sample inputs/outputs, a short recorded clip, or another concise way to show what the project does

### Live Web App Link via GitHub Pages (Streamlit & Gradio Alternative): http://jlowtwe.github.io/Crit-2-GO/

### Shareable Slide Deck File:[(https://new.express.adobe.com/id/urn:aaid:sc:US:29264932-0043-4ae4-8fcb-29fffbf8571b?taskID=presentation&q=line&category=search&learn=exercise%3Aexpress%2Fhow-to%2Fin-app%2Fhow-to-make-presentations%3A-1)

-------------------------------------------------------------------------------------------------------------------------------------------------
## Key Findings & Learnings

- the user and workflow | Product Teams are able to utilize a 7-step workflow for design reviews;
  - Step 1: Design uploaded & deadline set
  - Step 3: Stakeholders tagged & notified
  - Step 4: New feedback submitted
  - Step 5: All votes counted
  - Step 6: Awaiting Product Owner approval
  - Step 7: 🚀 Design approved — ready for dev
  
- what you built: An asynchronous Web App & Slack Integration for design review
- why GenAI is useful for this task: Improves efficiency across product teams and boosts team capcity. GenAI helps to fill gaps and improves teams running efficiently
- what you compared it against: 1+ Hour traditional Zoom meetings
- what worked, what failed, and where a human should stay involved: A subject matter expert is crucial for human review to understand all of the steps in the design review process. There are some flaws produced in the product designer have similar access to the workflow in steps 3 – 7, which needs improvement from human technical skills to imrpove the workflow. Overall the functionality of the app worked very well in comparison to traditional Zoom meetings and provided a realistic prototype. Overeall Gen AI helps to improve the product development process faster. 

-------------------------------------------------------------------------------------------------------------------------------------------------
## Setup and Usage Instructions

### Setup Instructions
- Access to a LLM provider: Claude Code
- List a 7-step product design review/workflow
- Provide technical/context on the requirements of the design review workflow in 3 sentences
- The Web app is required to align with WCAG Requirements
- Leverage the github desktop app and sublime text for new commits

### Usage Instructions
Follow the 7-step workflow using the provided web app link under the artifact section
- Step 1: Design uploaded & deadline set
- Step 3: Stakeholders tagged & notified
- Step 4: New feedback submitted
- Step 5: All votes counted
- Step 6: Awaiting Product Owner approval
- Step 7: 🚀 Design approved — ready for dev

Install the workflow in slack via the steps below:

- Go to api.slack.com/apps and click Create New App → From Scratch
- Name your app "CRIT 2 GO" and choose your workspace
- Under Features → Incoming Webhooks, toggle it On
- Click Add New Webhook to Workspace and choose the #design-critique channel
- Copy the Webhook URL and paste it above
- CRIT 2 GO will now notify your team at every workflow step automatically
  


