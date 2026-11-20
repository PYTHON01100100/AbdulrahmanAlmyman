---
ai-engineer-roadmap:
  name: "The AI Engineer Roadmap: From Zero to Advanced"
  caseStudyId: ai-engineer-roadmap
  description: A practical path into AI, from programming and math to deep learning, transformers, LLMs and production, with career tracks, a clear goal for each stage, and the resources I recommend.
  repo: ""
  url: ""
  images: []
  show: true
  date: "2024-11-01"
  type: "blog"
---

Publish date: `2024-11-01` · Last updated: `2026-11-20`

# The AI Engineer Roadmap: From Zero to Advanced

![The tools of an AI engineer: Python, scikit-learn, PyTorch, TensorFlow, Hugging Face, LangChain, vLLM, Ollama, SGLang, Bifrost, Docker, Kubernetes, AWS, Google Cloud, NVIDIA, Linux and open models like Qwen, Llama and DeepSeek](/ai-engineer-roadmap/ai-tools.jpg)

Hello! People often ask me where to start if they want to work in AI. There are thousands of courses, videos and papers out there, and the hard part is not finding resources. It is knowing **which one to use, and when**.

This roadmap has seven stages, from zero to advanced. Read them as a **reference sequence**, not as a list you must finish before applying for a job. Everyone needs Stage 0. After that, **pick a track** and go deep on the stages it needs. You can skim the rest. Each stage ends with a short **"Ready to move on when…"** check, so you know when you are done.

The tools in the cover image are examples. You don't need all of them, and no single job uses all of them.

## Choose your track

Different roles focus on different parts of the roadmap:

| Role | Focus | Key stages | Typical tools |
|---|---|---|---|
| **Applied AI Engineer** (product) | Building apps, RAG, agents and evaluations | 0, 3, 4, 5 | Python, model APIs, Hugging Face, Ollama, Bifrost, sometimes a framework like LangChain |
| **ML Engineer** (training and fine-tuning) | Training models, fine-tuning, datasets and benchmarks | 0, 1, 2, 3, 4 | PyTorch, scikit-learn, Hugging Face, GPU training |
| **AI Solutions Architect / Infrastructure Engineer** | Cloud architecture, model serving, latency and cost | 0, 4, 5, plus cloud and DevOps | Linux, Docker, vLLM or SGLang, often Kubernetes, a cloud provider such as AWS or Google Cloud, NVIDIA GPUs |
| **AI Research Scientist** | New architectures, reading and implementing papers | All stages, 0 to 6 | PyTorch, research papers, CUDA for performance work |

In short:

- **Applied AI** is about shipping a useful, measured product. Stage 5 matters most, and Stages 1 and 2 can stay at the level of intuition.
- **ML engineering** is about training and evaluating models well. Stages 1 to 4 matter most.
- **Infrastructure** is about running models reliably and cheaply. Serving, GPUs and cloud matter more than model math.
- **Research** needs the full depth of every stage, plus reading papers every week.

What I have seen in the market, as personal observations and not statistics:

- **Many roles build on existing models.** Most AI job posts I see are about applying, integrating and deploying models, not about training foundation models from scratch.
- **Engineering skills matter in interviews.** Software engineering, Linux, Docker and API skills, together with solid LLM knowledge, often count as much as theory.
- **Build one project for your track.** For example: an evaluated RAG or agent app for Applied AI, a fine-tuned domain model for ML engineering, or a vLLM deployment for infrastructure.

## The roadmap at a glance

| Stage | What you learn | Start with |
|---|---|---|
| 0. Foundations | Programming, math and Git | My programming and math roadmaps |
| 1. Classic machine learning | Learn and practice models, training, evaluation | Google's Machine Learning courses, then scikit-learn |
| 2. Deep learning | Learn and practice neural networks, from intuition to depth | 3Blue1Brown, MIT 6.S191, *Understanding Deep Learning*, then PyTorch |
| 3. Transformers | The architecture behind LLMs | Transformer Explainer |
| 4. Large language models | How LLMs are built and fine-tuned | *Hands-On Large Language Models*, Hugging Face Learn |
| 5. AI engineering | Building real products on models | *AI Engineering* by Chip Huyen |
| 6. Research | Reading papers and keeping up | How to read research papers |

## Stage 0: Foundations

Before AI, you need **programming** and **math**.

- **Programming:** learn Python well. Variables, loops, functions, data structures and OOP, plus working with **JSON** and calling **APIs**, because that is how you talk to models later. If you are new, start with my article [How to Start Learning Programming](/case-study/learn-programming).
- **Math:** linear algebra, calculus and probability. My article [The Math Behind Machine Learning](/case-study/math-for-machine-learning) shows the order to learn them in, with my KSU course notes.
- **Git and GitHub:** create a repository, push your work, write clear commit messages and use branches. Every project you build from here on should live on GitHub.
- **GPU basics:** know why GPUs speed up deep learning (they run many operations in parallel) and how to move a model and its tensors to a GPU in PyTorch. That is enough for now. **Writing CUDA kernels is optional**, a later specialization for infrastructure, performance or research work. When you get there, my notes from the **CSC 453 Parallel Processing** course at KSU are in the [CSC453 repository](https://github.com/PYTHON01100100/CSC453_68199_1_2024-Parallel-Processing_KSU).
- **Practice:** [Brilliant](https://brilliant.org/) has short interactive lessons in math, data and computer science. It is a good way to keep your skills sharp a few minutes a day.

Don't skip this stage. In my experience, people who get stuck later are usually stuck on the math or the code, not on AI.

**Ready to move on when** you can write a small Python script that reads JSON or calls an API, keep it on GitHub, and explain what a derivative and a matrix multiplication do.

## Stage 1: Classic machine learning

Deep learning is one part of machine learning. Learn the basics first: what a model is, how training works, what overfitting is, and how to evaluate results.

**Learn:**

- [Google for Developers: Machine Learning](https://developers.google.com/machine-learning): free courses from Google. The **foundational courses** cover machine learning fundamentals and core concepts, and Google recommends taking them in order. Start here.
- [CSC 462 Machine Learning (KSU)](https://github.com/PYTHON01100100/CSC462_Machine_Learning_KSU_46): my repository from the machine learning course at King Saud University.
- [A Roadmap to Learn AI in 2025](https://medium.com/bitgrit-data-science-publication/a-roadmap-to-learn-ai-in-2024-cc30c6aa6e16): another roadmap on Medium (bitgrit Data Science Publication). Read it to compare paths and fill any gaps.

**Practice with the framework: scikit-learn.**

- [scikit-learn: Getting Started](https://scikit-learn.org/stable/getting_started.html): the standard Python library for classic ML. Linear and logistic regression, decision trees, random forests, SVMs, clustering, plus train/test splitting and metrics, all with the same simple `fit` / `predict` API.
- Use it together with **NumPy** (arrays and math), **pandas** (loading and cleaning tables) and **Matplotlib** (plots). Much of classic ML work happens in these four libraries.

A good exercise: take a public dataset, clean it with pandas, train two or three scikit-learn models, and compare them with the right metric.

**Ready to move on when** you can compare models against a simple baseline, choose a metric that fits the problem, and keep your test data out of preprocessing and training so there is no data leakage.

## Stage 2: Deep learning

Now go deep into neural networks: backpropagation, CNNs, RNNs, regularization and optimization.

**Start with the intuition.** Before any course, watch how a neural network works **visually**:

- [But what is a neural network?](https://youtu.be/aircAruvnKk) by 3Blue1Brown: the clearest introduction I know. Neurons, layers and weights, explained with animations.

After this video, words like "layer", "weight" and "activation" will mean something to you.

**Learn:**

- [MIT 6.S191: Introduction to Deep Learning](https://youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI): MIT's introductory course, free on YouTube. Short, modern and practical. This is your main course for this stage.
- [Understanding Deep Learning](https://udlbook.github.io/udlbook/) by Simon J.D. Prince: a complete deep learning book, free to read online, with notebooks for practice. Use it next to the course when you want the full explanation behind a topic.

**Practice with a framework.** Pick **one** and learn it well. PyTorch is widely used in research and in the open LLM ecosystem, so I recommend starting there.

- **PyTorch:** the [official tutorials](https://pytorch.org/tutorials/) teach tensors, autograd, `nn.Module` and the training loop. [The Incredible PyTorch](https://github.com/ritchieng/the-incredible-pytorch) is a curated list of PyTorch tutorials, papers, projects and communities for when you want more.
- **Keras and TensorFlow:** [Keras 3](https://keras.io/) is a high-level API that runs on several backends, including TensorFlow, PyTorch and JAX. It is a gentle way to build your first networks. [Introduction to TensorFlow](https://www.tensorflow.org/learn) has Google's official guides and tutorials.

A good exercise: rebuild a model from your deep learning course in PyTorch from scratch, without copying the code. Use a GPU if you have access to one, but small models train fine without it. In my [image classifier article](/case-study/train-cv-model-oss), GPU instances were sold out in my region, so I trained a small CNN for 9 types of Saudi dates on CPUs.

**Ready to move on when** you can write a training loop yourself and explain what the training and validation results tell you, including when the model is overfitting.

## Stage 3: Transformers

The transformer is the architecture behind GPT, BERT, T5 and most of today's LLMs. Learn it from three angles, from easiest to deepest:

1. **Watch:**
   - [Transformers, explained: Understand the model behind GPT, BERT, and T5](https://youtu.be/SZorAJ4I-sA): a short, non-technical overview of what transformers are and why they matter.
   - [Illustrated Guide to Transformers Neural Network: A step by step explanation](https://youtu.be/4Bdc55j80l8): walks through attention, encoders and decoders step by step.
   - [Transformers, the tech behind LLMs](https://youtu.be/wjZofJX0v4M) by 3Blue1Brown: the visual explanation, in the same style as the neural network video in Stage 2.
2. **Play:** [Transformer Explainer](https://poloclub.github.io/transformer-explainer/): an interactive tool that runs a GPT-2 model in your browser. Type text and watch every step of the model, from tokens to attention to the next word.
3. **Build:** [llama3-from-scratch](https://github.com/naklecha/llama3-from-scratch/tree/main): implements Llama 3 one matrix multiplication at a time. Do this when the videos feel easy, and the architecture will stop being a black box.

**Ready to move on when** you can explain, in your own words, how text becomes tokens, what attention does, and how the model predicts the next token.

## Stage 4: Large language models

Now you know the architecture. This stage is about how LLMs are **built, trained and adapted**.

- [Stanford CS229: Building Large Language Models (LLMs)](https://youtu.be/9vM4p9NN0Ts): one lecture that covers the whole picture: pretraining, data, evaluation, scaling and post-training.
- [Hands-On Large Language Models](https://www.llm-book.com/) by Jay Alammar and Maarten Grootendorst: a very visual, practical book on using and building with LLMs.
- [Hugging Face Learn](https://huggingface.co/learn): free courses on the Hugging Face ecosystem: transformers, LLMs, agents, diffusion and more.
- [Finetuning Transformer Models](https://www.codecademy.com/learn/finetuning-transformer-models) on Codecademy: how to adapt a pre-trained model to your own task.

**Ready to move on when** you can explain the difference between pretraining, fine-tuning and prompting, and load and run an open model with Hugging Face.

## Stage 5: AI engineering

An AI engineer does not just train models. They **build products** on top of them: prompting, retrieval (RAG), agents, evaluation, serving, cost and latency. As Baraa puts it in his [AI Engineering Roadmap for 2026](https://www.blog.datawithbaraa.com/p/ai-engineering-roadmap-for-2026), it is **a builder role**: companies already have strong models, and the job is to connect them to the company's data and tools, and make the system safe, fast and reliable. That makes it closer to backend and data engineering than to research.

The building blocks, in the order I would learn them:

1. **Prompt engineering:** clear communication with the model: give it context, a task, a role and examples.
2. **Model APIs:** call models from Python, both closed models through an API and open models from [Hugging Face](https://huggingface.co/models) that you run yourself. Knowing both makes you flexible. Self-hosted open models give you more control over your data and setup. They can also cost less, but only if your usage is high enough to keep the GPUs busy and you run the infrastructure well.
3. **Frameworks (optional):** tools like LangChain connect models, prompts, memory, tools and multi-step logic. Many applications call the model APIs directly, so learn the basics without a framework first.
4. **RAG (retrieval-augmented generation):** split your documents into chunks, turn them into embeddings, store them in a vector database, search them by meaning, and add the best matches to the prompt. This is how a model answers from your own data.
5. **Agents:** a chatbot gives you text, an agent takes actions: it calls APIs, queries databases and triggers workflows.
6. **MCP (Model Context Protocol):** an open protocol that standardizes how AI applications connect to tools and data sources. It does not make an agent safe on its own. The [specification](https://modelcontextprotocol.io/specification/latest) says MCP cannot enforce security principles at the protocol level, so user consent, authorization, access control and audit logging still have to be implemented by the application and the server.
7. **LLMOps:** monitoring, logging, tracking prompts and costs, and CI/CD. Without it, things break quietly.

**Evaluate from the first prototype.** As soon as something works, write a small set of test cases that look like real use, including hard and edge cases, with the answers you expect. Run them after every change. When something fails, read the failures and group them by cause before you fix anything. Track quality, latency and cost together, because improving one often costs you another: a bigger model or more retrieved chunks can raise quality but also latency and cost. For RAG, measure the two halves separately: **retrieval quality** (did the right chunks come back?) and **answer quality** (is the answer correct and supported by those chunks?). A wrong answer from good chunks is a prompt or model problem; a wrong answer from bad chunks is a retrieval problem.

Resources:

- [AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) by Chip Huyen (O'Reilly): the book for this stage. It covers how to build applications with foundation models, from evaluation to fine-tuning to deployment.
- [Google Cloud Skills Boost paths](https://www.skills.google/paths): learning paths for machine learning and generative AI on Google Cloud. Cloud skills are useful, because many production models are served from the cloud.
- [DeepLearning.AI](https://www.deeplearning.ai/): courses and short courses on machine learning, deep learning and generative AI, including LLM apps, RAG and agents. A good reference for every stage of this roadmap.

Three projects worth building here, also from Baraa's roadmap: a **"talk to your documents"** assistant (RAG over PDFs, with citations), a **"talk to your data"** app (natural language to SQL, with a table or chart as the answer), and an **email agent** that reads incoming mail and drafts replies. Build one or two of them well, with an evaluation set, and document them.

Models are only useful when they run somewhere. For real examples, see my articles on [serving LLMs with LiteLLM and vLLM on Alibaba Cloud ACK](/case-study/llm-serving-litellm-vllm-ack) and [training an image classifier with data in OSS](/case-study/train-cv-model-oss).

**Ready to move on when** you have deployed an application with an evaluation set, looked at its failures, and measured its latency and cost per request.

## Stage 6: Research and keeping up

AI moves every week. At the advanced level, you learn from papers, not only courses.

- [How to read research papers, in 5 minutes](https://masonjwang.com/writing/reading-research) by Mason Wang: a short guide to reading papers without getting lost. Read it before your first paper.

**Ready to move on when** you can summarize a paper's problem, method and results in a few sentences, and re-implement one small idea from it.

## For Arabic readers

If Arabic is your first language, these resources explain the same ideas in Arabic. They are a great companion to the stages above:

- [Namaa NLP course](https://www.namaa.space/course) (دورة نماء في معالجة اللغة الطبيعية): a course in Arabic on natural language processing. Take it alongside Stage 3 and Stage 4.
- [The Annotated Transformer, English–Arabic version](https://huggingface.co/spaces/Omartificial-Intelligence-Space/The-Annotated-Transformer-En-Ar-Version): the transformer explained line by line with its code, in Arabic and English. Use it in Stage 3, next to Transformer Explainer.
- [LLM Glossary](https://huggingface.co/spaces/Omartificial-Intelligence-Space/llm-glossary): how a language model learns, one term at a time, in Arabic and English. Keep it open in Stage 4 whenever a new term appears.

## My advice

- **Build while you learn.** After every stage, make one small project and put it on GitHub. Projects teach you more than certificates, and they give employers something concrete to look at.
- **One resource at a time.** Finish one course before you start another. Collecting courses is not learning.
- **Don't fear the math.** You don't need to be a mathematician, but you need to understand what a gradient is and why matrices are everywhere.
- **Learn how models are served.** Knowing how to deploy and serve a model, often on cloud GPUs, makes you much more useful than knowing only how to train one.

## Conclusion

The full path is long, but you don't have to walk all of it at once. Start with the foundations, choose the track that fits the job you want, and go deep on the stages that track needs. Use each "Ready to move on when…" check to decide when to continue, build something at each step, and come back to this list when you are ready for the next one. Good luck!

## References

- [CSC 453 Parallel Processing (KSU)](https://github.com/PYTHON01100100/CSC453_68199_1_2024-Parallel-Processing_KSU): my course repository, parallel programming and CUDA
- [Brilliant](https://brilliant.org/): interactive lessons in math, data and computer science
- [Google for Developers: Machine Learning](https://developers.google.com/machine-learning): foundational courses, taken in order
- [scikit-learn: Getting Started](https://scikit-learn.org/stable/getting_started.html)
- [CSC 462 Machine Learning (KSU)](https://github.com/PYTHON01100100/CSC462_Machine_Learning_KSU_46): my course repository
- [A Roadmap to Learn AI in 2025](https://medium.com/bitgrit-data-science-publication/a-roadmap-to-learn-ai-in-2024-cc30c6aa6e16) on Medium
- [But what is a neural network?](https://youtu.be/aircAruvnKk) by 3Blue1Brown
- [MIT 6.S191: Introduction to Deep Learning](https://youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI)
- [Understanding Deep Learning](https://udlbook.github.io/udlbook/) by Simon J.D. Prince
- [PyTorch tutorials](https://pytorch.org/tutorials/)
- [The Incredible PyTorch](https://github.com/ritchieng/the-incredible-pytorch): tutorials, papers, projects and communities for PyTorch
- [Keras 3](https://keras.io/): multi-backend deep learning API
- [Introduction to TensorFlow](https://www.tensorflow.org/learn)
- [Transformers, explained: Understand the model behind GPT, BERT, and T5](https://youtu.be/SZorAJ4I-sA)
- [Illustrated Guide to Transformers Neural Network: A step by step explanation](https://youtu.be/4Bdc55j80l8)
- [Transformers, the tech behind LLMs](https://youtu.be/wjZofJX0v4M) by 3Blue1Brown
- [Transformer Explainer](https://poloclub.github.io/transformer-explainer/): interactive GPT-2 in the browser
- [llama3-from-scratch](https://github.com/naklecha/llama3-from-scratch/tree/main)
- [Stanford CS229: Building Large Language Models (LLMs)](https://youtu.be/9vM4p9NN0Ts)
- [Hands-On Large Language Models](https://www.llm-book.com/) by Jay Alammar and Maarten Grootendorst
- [Hugging Face Learn](https://huggingface.co/learn)
- [Finetuning Transformer Models](https://www.codecademy.com/learn/finetuning-transformer-models) on Codecademy
- [AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) by Chip Huyen (O'Reilly)
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification/latest)
- [Google Cloud Skills Boost paths](https://www.skills.google/paths)
- [DeepLearning.AI](https://www.deeplearning.ai/): courses on ML, deep learning and generative AI
- [AI Engineering Roadmap for 2026](https://www.blog.datawithbaraa.com/p/ai-engineering-roadmap-for-2026) by Baraa (Data with Baraa): AI engineering as a builder role, the building blocks from prompts to LLMOps, and project ideas
- [Namaa NLP course](https://www.namaa.space/course) (دورة نماء في معالجة اللغة الطبيعية): NLP in Arabic
- [The Annotated Transformer, English–Arabic version](https://huggingface.co/spaces/Omartificial-Intelligence-Space/The-Annotated-Transformer-En-Ar-Version) on Hugging Face Spaces
- [LLM Glossary](https://huggingface.co/spaces/Omartificial-Intelligence-Space/llm-glossary) on Hugging Face Spaces: LLM terms in Arabic and English
- [How to read research papers, in 5 minutes](https://masonjwang.com/writing/reading-research) by Mason Wang
