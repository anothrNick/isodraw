<!-- diagram -->
## Overview

**Ask Juniper** answers customer questions for Juniper Home, a smart-thermostat maker, using the company's own help articles. It's retrieval-augmented: for every question the [@assistant](isodraw:node/assistant) looks up the most relevant passages in the [@Vector index](isodraw:node/vectors), then asks a model on [@Bedrock](isodraw:node/bedrock) to answer from those passages only.

When it can't answer confidently, or a customer asks for a person, the conversation goes to [@Ticketing](isodraw:node/ticketing) and on to [@Support agents](isodraw:node/agents), with the full history attached.

## How it's doing

| Metric | Last 30 days |
| --- | --- |
| Conversations | 41,000 |
| Resolved without a person | 68% |
| Handed off | 24% |
| Abandoned | 8% |
| Median time to first answer | 2.1 s |

## Guardrails

- Answers must cite at least one help article; if none matches well enough, the assistant offers a handoff instead of guessing.
- No account actions: the assistant can explain how to reset a thermostat but never changes settings itself.
- Personal data in questions is masked before it's stored in [@Conversations](isodraw:node/convos).

<!-- node:customers -->
Juniper's customers, mostly homeowners setting up or troubleshooting a thermostat. Busiest on cold Monday mornings.

<!-- node:help -->
The public help center. It shows the same articles the assistant uses, published from the [@Knowledge base](isodraw:node/kb), so customers can always read the source of an answer.

<!-- node:widget -->
The chat widget on the help center and in the web app. It keeps a WebSocket open to [@API Gateway](isodraw:node/apigw) so answers stream in word by word.

<!-- node:app -->
The Juniper mobile app's Help tab, which uses the same API. It sends the thermostat model and firmware version with each question, so answers fit the device.

<!-- node:aws -->
The AWS account `ask-juniper-prod` in `us-east-1`. All of it is serverless, so cost follows the number of conversations.

<!-- node:apigw -->
API Gateway with a WebSocket API for chat and a REST API for feedback.

| Setting | Value |
| --- | --- |
| Auth | Signed-in customers, or anonymous with a CAPTCHA token |
| Throttling | 5 messages per 10 seconds per connection |
| Idle timeout | 10 minutes |

<!-- node:assistant -->
The orchestrator: a Lambda function that runs one turn of a conversation.

1. Loads recent turns from [@Conversations](isodraw:node/convos).
2. Rewrites the question as a standalone search query.
3. Fetches the top 6 passages from the [@Vector index](isodraw:node/vectors).
4. Asks [@Bedrock](isodraw:node/bedrock) for an answer that cites them, and streams it back.
5. If the best passage scores below 0.55, or the customer asks for a person, opens a ticket instead.

<!-- node:bedrock -->
Amazon Bedrock hosts both models: a chat model for answers and an embedding model for search. Prompts and answers aren't used to train the models.

| Use | Model setting |
| --- | --- |
| Answers | Temperature 0.2, at most 600 output tokens |
| Embeddings | 1,024 dimensions |

<!-- node:vectors -->
OpenSearch Serverless with a vector index of about 38,000 passages from 2,100 help articles. Each passage keeps its article URL, heading and thermostat models, so results can be filtered to the customer's device.

<!-- node:convos -->
DynamoDB table with every conversation turn, kept for 90 days. Personal data is masked before it's written. Support agents see the history when a conversation is handed off.

<!-- node:ingest -->
A Lambda function that keeps the index current. When an article changes in [@Help articles](isodraw:node/articles), it splits the article into passages of about 300 words, embeds them with [@Bedrock](isodraw:node/bedrock), and replaces that article's passages in the [@Vector index](isodraw:node/vectors).

<!-- node:articles -->
S3 bucket of published help articles as Markdown, one object per article and language. Versioning is on, so an answer can always be traced to the exact text it cited.

<!-- node:kb -->
The knowledge base where the support team writes and reviews articles. Publishing an article writes it to [@Help articles](isodraw:node/articles), which updates both the help center and the assistant within a few minutes.

<!-- node:ticketing -->
The ticketing system. Handed-off conversations arrive as tickets with the transcript, the passages the assistant found, and the customer's device details.

<!-- node:agents -->
Twenty-two support agents across two time zones. They rate each handoff, and the ratings feed back into the knowledge base: a frequent "no article covered this" means a new article gets written.

<!-- edge:e7 -->
The prompt contains the system instructions, the last 6 turns, and the retrieved passages with their article IDs. The model must answer only from those passages and cite them as `[1]`, `[2]`, and so on.

<!-- edge:e8 -->
A k-nearest-neighbor search for the 6 best passages, filtered by the customer's thermostat model and language.

<!-- edge:e10 -->
Handoff happens when no passage is relevant enough, when the customer asks for a person, or after two answers in a row get a thumbs-down.

<!-- edge:e14 -->
Each article's old passages are deleted and its new ones written in a single bulk request, so a search never returns a half-updated article.
