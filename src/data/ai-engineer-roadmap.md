---
ai-engineer-roadmap:
  name: "The AI Engineer Roadmap: From Zero to Advanced"
  caseStudyId: ai-engineer-roadmap
  description: A step-by-step path to becoming an AI engineer, from programming and math to deep learning, transformers, LLMs and production, with the resources I recommend at each stage.
  repo: ""
  url: ""
  images: []
  show: true
  date: "2024-11-01"
  type: "blog"
---

Publish date: `2024-11-01`

# The AI Engineer Roadmap: From Zero to Advanced

Hello! People often ask me where to start if they want to work in AI. There are thousands of courses, videos and papers out there, and the hard part is not finding resources. It is knowing **which one to use, and when**.

This is the roadmap I recommend. It goes from zero to advanced in seven stages, and every stage builds on the one before it. You don't need to finish every resource. Pick one or two per stage, go deep, build something small, and then move on.

## The roadmap at a glance

| Stage | What you learn | Start with |
|---|---|---|
| 0. Foundations | Programming, math and GPU computing | My programming and math roadmaps, CUDA |
| 1. Classic machine learning | Learn and practice models, training, evaluation | Google's Machine Learning courses, then scikit-learn |
| 2. Deep learning | Learn and practice neural networks, from intuition to depth | 3Blue1Brown, MIT 6.S191, *Understanding Deep Learning*, then PyTorch |
| 3. Transformers | The architecture behind LLMs | Transformer Explainer |
| 4. Large language models | How LLMs are built and fine-tuned | *Hands-On Large Language Models*, Hugging Face Learn |
| 5. AI engineering | Building real products on models | *AI Engineering* by Chip Huyen |
| 6. Research | Reading papers and keeping up | The 2025 AI Engineer Reading List |

## Stage 0: Foundations

Before AI, you need **programming** and **math**, and it helps a lot to understand how **GPUs** run code in parallel.

- **Programming:** learn Python well. Variables, loops, functions, data structures and OOP. If you are new, start with my article [How to Start Learning Programming](/case-study/learn-programming).
- **Math:** linear algebra, calculus and probability. My article [The Math Behind Machine Learning](/case-study/math-for-machine-learning) shows the order to learn them in, with my KSU course notes.
- **GPU computing (CUDA):** deep learning is fast because GPUs run thousands of operations in parallel. Learning parallel programming and CUDA explains why models train on GPUs, and what is happening when you move a tensor to `cuda`. My notes from the **CSC 453 Parallel Processing** course at KSU are in the [CSC453 repository](https://github.com/PYTHON01100100/CSC453_68199_1_2024-Parallel-Processing_KSU).
- **Practice:** [Brilliant](https://brilliant.org/) has short interactive lessons in math, data and computer science. It is a good way to keep your skills sharp a few minutes a day.

Don't skip this stage. Most people who get stuck later are stuck on the math or the code, not on AI.

## Stage 1: Classic machine learning

Deep learning is one part of machine learning. Learn the basics first: what a model is, how training works, what overfitting is, and how to evaluate results.

**Learn:**

- [Google for Developers: Machine Learning](https://developers.google.com/machine-learning): free courses from Google. The **foundational courses** cover machine learning fundamentals and core concepts, and Google recommends taking them in order. Start here.
- [CSC 462 Machine Learning (KSU)](https://github.com/PYTHON01100100/CSC462_Machine_Learning_KSU_46): my repository from the machine learning course at King Saud University.
- [A Roadmap to Learn AI in 2025](https://medium.com/bitgrit-data-science-publication/a-roadmap-to-learn-ai-in-2024-cc30c6aa6e16): another roadmap on Medium (bitgrit Data Science Publication). Read it to compare paths and fill any gaps.

**Practice with the framework: scikit-learn.**

- [scikit-learn tutorials](https://scikit-learn.org/1.4/tutorial/index.html): the standard Python library for classic ML. Linear and logistic regression, decision trees, random forests, SVMs, clustering, plus train/test splitting and metrics, all with the same simple `fit` / `predict` API.
- Use it together with **NumPy** (arrays and math), **pandas** (loading and cleaning tables) and **Matplotlib** (plots). Most classic ML work is these four libraries.

A good exercise: take a public dataset, clean it with pandas, train two or three scikit-learn models, and compare them with the right metric.

## Stage 2: Deep learning

Now go deep into neural networks: backpropagation, CNNs, RNNs, regularization and optimization.

**Start with the intuition.** Before any course, watch how a neural network works **visually**:

- [But what is a neural network?](https://youtu.be/aircAruvnKk) by 3Blue1Brown: the clearest introduction there is. Neurons, layers and weights, explained with animations.

After this video, words like "layer", "weight" and "activation" will mean something to you.

**Learn:**

- [MIT 6.S191: Introduction to Deep Learning](https://youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI): MIT's introductory course, free on YouTube. Short, modern and practical. This is your main course for this stage.
- [Understanding Deep Learning](https://udlbook.github.io/udlbook/) by Simon J.D. Prince: a complete deep learning book, free to read online, with notebooks for practice. Use it next to the course when you want the full explanation behind a topic.

**Practice with a framework: PyTorch or TensorFlow.** Pick **one** and learn it well. Today most research and LLM work uses PyTorch, so I recommend starting there.

- **PyTorch:** the [official tutorials](https://pytorch.org/tutorials/) teach tensors, autograd, `nn.Module` and the training loop. [The Incredible PyTorch](https://github.com/ritchieng/the-incredible-pytorch) is a curated list of PyTorch tutorials, papers, projects and communities for when you want more.
- **TensorFlow and Keras:** [Introduction to TensorFlow](https://www.tensorflow.org/learn) is Google's framework, with official guides and tutorials. Keras, its high-level API, is a gentle way to build your first networks.

A good exercise: rebuild a model from your deep learning course in PyTorch from scratch, without copying the code, and train it on a GPU.

## Stage 3: Transformers

The transformer is the architecture behind GPT, BERT, T5 and every modern LLM. Learn it from three angles, from easiest to deepest:

1. **Watch:**
   - [Transformers, explained: Understand the model behind GPT, BERT, and T5](https://youtu.be/SZorAJ4I-sA): a short, non-technical overview of what transformers are and why they matter.
   - [Illustrated Guide to Transformers Neural Network: A step by step explanation](https://youtu.be/4Bdc55j80l8): walks through attention, encoders and decoders step by step.
   - [Transformers, the tech behind LLMs](https://youtu.be/wjZofJX0v4M) by 3Blue1Brown: the visual explanation, in the same style as the neural network video in Stage 2.
2. **Play:** [Transformer Explainer](https://poloclub.github.io/transformer-explainer/): an interactive tool that runs a GPT-2 model in your browser. Type text and watch every step of the model, from tokens to attention to the next word.
3. **Build:** [llama3-from-scratch](https://github.com/naklecha/llama3-from-scratch/tree/main): implements Llama 3 one matrix multiplication at a time. Do this when the videos feel easy, and the architecture will stop being a black box.

## Stage 4: Large language models

Now you know the architecture. This stage is about how LLMs are **built, trained and adapted**.

- [Stanford CS229: Building Large Language Models (LLMs)](https://youtu.be/9vM4p9NN0Ts): one lecture that covers the whole picture: pretraining, data, evaluation, scaling and post-training.
- [Hands-On Large Language Models](https://www.llm-book.com/) by Jay Alammar and Maarten Grootendorst: a very visual, practical book on using and building with LLMs.
- [Hugging Face Learn](https://huggingface.co/learn): free courses on the Hugging Face ecosystem: transformers, LLMs, agents, diffusion and more. This is where you learn the tools the industry actually uses.
- [Finetuning Transformer Models](https://www.codecademy.com/learn/finetuning-transformer-models) on Codecademy: how to adapt a pre-trained model to your own task.

## Stage 5: AI engineering

An AI engineer does not just train models. They **build products** on top of them: prompting, retrieval (RAG), agents, evaluation, serving, cost and latency.

- [AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) by Chip Huyen (O'Reilly): the book for this stage. It covers how to build applications with foundation models, from evaluation to fine-tuning to deployment.
- [Google Cloud Skills Boost paths](https://www.skills.google/paths): learning paths for machine learning and generative AI on Google Cloud. Cloud skills matter, because real models run in the cloud.

Models are only useful when they run somewhere. For real examples, see my articles on [serving LLMs with LiteLLM and vLLM on Alibaba Cloud ACK](/case-study/llm-serving-litellm-vllm-ack) and [training an image classifier with data in OSS](/case-study/train-cv-model-oss).

## Stage 6: Research and keeping up

AI moves every week. At the advanced level, you learn from papers, not only courses.

- [How to read research papers, in 5 minutes](https://masonjwang.com/writing/reading-research) by Mason Wang: a short guide to reading papers without getting lost. Read it before your first paper.
- [The 2025 AI Engineer Reading List](https://latent.space/p/2025-papers/#%C2%A7section-agents) by Latent Space: the papers worth reading, grouped by topic: LLMs, benchmarks, prompting, RAG, agents, code generation, vision, voice, diffusion and fine-tuning.

## For Arabic readers

If Arabic is your first language, these resources explain the same ideas in Arabic. They are a great companion to the stages above:

- [Namaa NLP course](https://www.namaa.space/course) (دورة نماء في معالجة اللغة الطبيعية): a course in Arabic on natural language processing. Take it alongside Stage 3 and Stage 4.
- [The Annotated Transformer, English–Arabic version](https://huggingface.co/spaces/Omartificial-Intelligence-Space/The-Annotated-Transformer-En-Ar-Version): the transformer explained line by line with its code, in Arabic and English. Use it in Stage 3, next to Transformer Explainer.
- [LLM Glossary](https://huggingface.co/spaces/Omartificial-Intelligence-Space/llm-glossary): how a language model learns, one term at a time, in Arabic and English. Keep it open in Stage 4 whenever a new term appears.

## My advice

- **Build while you learn.** After every stage, make one small project and put it on GitHub. Projects teach you more than certificates, and they are what employers look at.
- **One resource at a time.** Finish one course before you start another. Collecting courses is not learning.
- **Don't fear the math.** You don't need to be a mathematician, but you need to understand what a gradient is and why matrices are everywhere.
- **Learn the cloud.** Most AI work runs on GPUs in the cloud. Knowing how to deploy and serve a model makes you much more useful than knowing only how to train one.

## Conclusion

The path to AI engineering is long, but it is clear: foundations, classic ML, deep learning, transformers, LLMs, engineering, and finally research. Go one stage at a time, build something at each step, and come back to this list when you are ready for the next one. Good luck!

## References

- [CSC 453 Parallel Processing (KSU)](https://github.com/PYTHON01100100/CSC453_68199_1_2024-Parallel-Processing_KSU): my course repository, parallel programming and CUDA
- [Brilliant](https://brilliant.org/): interactive lessons in math, data and computer science
- [Google for Developers: Machine Learning](https://developers.google.com/machine-learning): foundational courses, taken in order
- [scikit-learn tutorials](https://scikit-learn.org/1.4/tutorial/index.html)
- [CSC 462 Machine Learning (KSU)](https://github.com/PYTHON01100100/CSC462_Machine_Learning_KSU_46): my course repository
- [A Roadmap to Learn AI in 2025](https://medium.com/bitgrit-data-science-publication/a-roadmap-to-learn-ai-in-2024-cc30c6aa6e16) on Medium
- [But what is a neural network?](https://youtu.be/aircAruvnKk) by 3Blue1Brown
- [MIT 6.S191: Introduction to Deep Learning](https://youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI)
- [Understanding Deep Learning](https://udlbook.github.io/udlbook/) by Simon J.D. Prince
- [PyTorch tutorials](https://pytorch.org/tutorials/)
- [The Incredible PyTorch](https://github.com/ritchieng/the-incredible-pytorch): tutorials, papers, projects and communities for PyTorch
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
- [Google Cloud Skills Boost paths](https://www.skills.google/paths)
- [Namaa NLP course](https://www.namaa.space/course) (دورة نماء في معالجة اللغة الطبيعية): NLP in Arabic
- [The Annotated Transformer, English–Arabic version](https://huggingface.co/spaces/Omartificial-Intelligence-Space/The-Annotated-Transformer-En-Ar-Version) on Hugging Face Spaces
- [LLM Glossary](https://huggingface.co/spaces/Omartificial-Intelligence-Space/llm-glossary) on Hugging Face Spaces: LLM terms in Arabic and English
- [How to read research papers, in 5 minutes](https://masonjwang.com/writing/reading-research) by Mason Wang
- [The 2025 AI Engineer Reading List](https://latent.space/p/2025-papers/#%C2%A7section-agents) by Latent Space
