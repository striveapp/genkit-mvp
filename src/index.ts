import * as z from "zod";

// Import the Genkit core libraries and plugins.
import { generate } from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { defineFlow, startFlowsServer } from "@genkit-ai/flow";
import { vertexAI } from "@genkit-ai/vertexai";

// Import models from the Vertex AI plugin. The Vertex AI API provides access to
// several generative models. Here, we import Gemini 1.5 Flash.
import { gemini15Flash } from "@genkit-ai/vertexai";

configureGenkit({
  plugins: [
    // Load the Vertex AI plugin. You can optionally specify your project ID
    // by passing in a config object; if you don't, the Vertex AI plugin uses
    // the value from the GCLOUD_PROJECT environment variable.
    vertexAI({ location: process.env.GCLOUD_LOCATION ?? "europe-west1" }),
  ],
  // Log debug output to tbe console.
  logLevel: "debug",
  // Perform OpenTelemetry instrumentation and enable trace collection.
  enableTracingAndMetrics: true,
});

// Define a simple flow that prompts an LLM to generate menu suggestions.
export const striveFlow = defineFlow(
  {
    name: "striveFlow",
    inputSchema: z.object({
      role: z.string(),
      problem: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ role, problem }) => {
    // Construct a request and send it to the model API.
    const llmResponse = await generate({
      prompt: `You act as a mentor. Recommend a possible action a ${role} can take in order to overcome a problem they have encountered at work which they have described as: ${problem}. Identify the underlying symptom. Then offer a concrete measure to take, and how to follow up with it to make sure the measure is implemented correctly. Finally list the symptoms you have identified. Format the response as a JSON document following this structure: "{
    "symptom": string,"measure": string,"follow_up": string,"identified_symptoms": Array<string>}"`,
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
      context: [
        // Rules
        {
          content: [
            {
              text: [
                `Use the following rules to generate measure suggestions:`,
                ``,
                // Rule 1 - Task Management Challenges
                `Rule 1: Task Management Challenges`,
                `User Input Indicators:`,
                `"I keep missing deadlines."`,
                `"I forgot about the meeting."`,
                `"I struggle to take notes during presentations."`,
                `Possible Underlying Issues:`,
                `Difficulty with organization and memory, which may be associated with conditions like ADHD or dyslexia.`,
                `Recommended Actions:`,
                `Suggest organizational tools (e.g., digital calendars, reminder apps).`,
                `Encourage discussing potential accommodations like flexible deadlines or note-taking support.`,
                `Provide resources on time management strategies.`,
                ``,
                // Rule 2
                `Rule 2: Emotional and Behavioral Responses`,
                `User Input Indicators:`,
                `"I felt overwhelmed and snapped at a colleague."`,
                `"I avoid team meetings because they make me anxious."`,
                `"I get irritated easily at work."`,
                `Possible Underlying Issues:`,
                `Emotional regulation difficulties, which may be linked to conditions like autism spectrum disorder (ASD) or anxiety disorders.`,
                `Recommended Actions:`,
                `Suggest stress management techniques (e.g., deep breathing exercises).`,
                `Encourage setting aside quiet time during the day.`,
                `Provide resources on effective communication and coping strategies.`,
                ``,
                // Rule 3
                `Rule 3: Focus and Attention Difficulties`,
                `User Input Indicators:`,
                `"I can't seem to focus on my tasks."`,
                `"I get easily distracted by noise."`,
                `"I can work for hours on one task and lose track of time."`,
                `Possible Underlying Issues:`,
                `Attention regulation issues, potentially related to ADHD or sensory processing differences.`,
                `Recommended Actions:`,
                `Recommend creating a distraction-free workspace.`,
                `Suggest using focus techniques like the Pomodoro Technique.`,
                `Encourage discussing accommodations like noise-canceling headphones or flexible scheduling.`,
                ``,
                // Rule 4
                `Rule 4: Need for Routine and Structure`,
                `User Input Indicators:`,
                `"I feel stressed when plans change unexpectedly."`,
                `"I prefer to follow strict routines."`,
                `"I struggle with indecisiveness."`,
                `Possible Underlying Issues:`,
                `Need for predictability, possibly associated with ASD or anxiety disorders.`,
                `Recommended Actions:`,
                `Suggest implementing personal routines to add structure.`,
                `Encourage planning ahead and setting clear expectations.`,
                `Provide resources on coping with change and building flexibility.`,
                ``,
                // Rule 5
                `Rule 5: Confidence and Coping Issues`,
                `User Input Indicators:`,
                `"I don't feel confident in my work anymore."`,
                `"I'm not coping well with my workload."`,
                `"I'm considering filing a grievance."`,
                `Possible Underlying Issues:`,
                `Low self-esteem or burnout, which may be related to various mental health conditions.`,
                `Recommended Actions:`,
                `Encourage self-care practices and setting realistic goals.`,
                `Suggest speaking with a trusted colleague or mentor.`,
                `Provide resources on resilience and seeking support.`,
                ``,
                `
Here is a list of typical issues that you can use to identify areas for improvement:    

1. Task Management Issues
 - Missing deadlines or forgetting tasks.
 - Struggling to take notes due to speed or handwriting.
 - Difficulty remembering things like phone numbers or messages.
 - Being persistently late or forgetting meetings.
 - Making mistakes in written work, such as spelling or numerical errors.

2. Behavior and Communication
 - Erratic or unpredictable behavior (e.g., overwhelm and anxiety).
 - Emotional responses (e.g., irritability, aggression, tearfulness).
 - Being abrupt, blunt, or overly direct.
 - Avoiding conversations, small talk, or networking events.
 - Appearing withdrawn from colleagues or activities.
 - Complaining about workload or lack of management support.

3. Focus and Attention
 - Difficulty staying focused on some tasks.
 - Prone to distractions.
 - Hyperfocusing on specific tasks.

4. Routine and Structure
 - Wanting to follow routines, procedures, and processes strictly.
 - Appearing inconsistent in work or learning patterns.
 - Being indecisive.

5. Confidence and Coping
 - Displaying a loss of confidence.
 - Complaining about not coping with workload.
 - Quick to use grievance procedures.

6. Work Errors and Performance
 - Increased errors or accidents.
 - Making mistakes in writing (e.g., spelling or numerical errors).

These are workspace specific rules that can provide accommodation for some symptoms:

Flexible Communication Rules

- Request meeting materials in advance.
  Description: Employees can request that all meeting materials (agendas, reports, slides) are sent to them in advance to prepare better and reduce anxiety.
- Opt for asynchronous communication where possible.
  Description: Suggest using email or project management tools for updates or feedback, reducing the pressure of immediate responses.
- Request written follow-ups after meetings.
  Description: Employees can ask for concise written summaries or action items following meetings to avoid misunderstandings.

Workspace Customization Rules
- Request flexible work hours.
  Description: Employees can request permission to start and end work at non-standard times that align better with their energy levels or personal needs.
- Request changes to workspace setup.
  Description: Employees can adjust their physical workspace, such as moving to quieter areas or using noise-canceling headphones.
- Limit unnecessary distractions in the work environment.
  Description: Suggest reducing visual or auditory distractions using privacy screens or soundproof panels.

Task and Workflow Management Rules

- Request no-meeting or low-meeting days.
  Description: Employees can request days where meetings are minimized, allowing for focused work time.
- Break large tasks into smaller, manageable steps.
  Description: Suggest splitting complex tasks into smaller pieces with clear milestones to reduce overwhelm.
- Request priority task clarification.
  Description: Employees can ask for a clear prioritization of tasks to help them focus on critical items.

Support and Feedback Rules

- Request regular feedback and check-ins with managers.
  Description: Employees can ask for shorter, more frequent feedback sessions rather than long performance reviews.
- Request support in writing rather than verbally.
  Description: Employees can ask for requests, feedback, or instructions to be delivered in written form for clarity.

Tools and Technology Adjustments Rules

- Request digital tools that match personal work styles.
  Description: Employees can request tools like task management apps that align with their preferences.
- Adjust notification settings on digital tools.
  Description: Employees can reduce distracting notifications by adjusting app settings.

General Mental Health and Well-being Support Rules

- Request mental health days.
  Description: Employees can request designated mental health days without disclosing their neurodivergent condition.
- Request access to quiet or low-stimulation spaces.
  Description: Employees can request access to low-sensory environments free from distractions.

Work-Life Balance and Autonomy Rules

- Set clear boundaries for after-work communication.
  Description: Employees can request that work-related communication outside of hours is minimized.
- Negotiate deadlines based on realistic expectations.
  Description: Employees can request flexible deadlines or extensions without needing formal disclosure.

Career Development and Progress Rules

- Request performance reviews based on personal strengths.
  Description: Employees can ask for reviews that focus on strengths rather than rigid criteria.
- Request training opportunities to improve relevant skills.
  Description: Employees can request access to skills development that aligns with their working style.
`,
              ].join("\n"),
            },
          ],
        },
      ],
    });

    // Handle the response from the model API. In this sample, we just convert
    // it to a string, but more complicated flows might coerce the response into
    // structured output or chain the response into another LLM call, etc.
    return llmResponse.text();
  },
);

// Start a flow server, which exposes your flows as HTTP endpoints. This call
// must come last, after all of your plug-in configuration and flow definitions.
// You can optionally specify a subset of flows to serve, and configure some
// HTTP server options, but by default, the flow server serves all defined flows.
startFlowsServer();
