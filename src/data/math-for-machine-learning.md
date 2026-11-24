---
math-for-machine-learning:
  name: "The Math Behind Machine Learning: My Roadmap from KSU Courses"
  caseStudyId: math-for-machine-learning
  description: How the math I have studied at King Saud University since 2021 maps to the three pillars of machine learning, following The Palindrome's roadmap, with my course notes as references.
  repo: ""
  url: ""
  images: []
  show: true
  date: "2024-09-01"
  type: "blog"
---

Publish date: `2024-09-01` · Last updated: `2026-11-20`

# The Math Behind Machine Learning: My Roadmap from KSU Courses

![Visual summary of the three mathematical pillars of machine learning: Linear Algebra (z = Wx + b), Calculus gradient descent, and Probability integration.](/math-for-machine-learning/math-pillars.jpg)

Since 2021 I have been studying mathematics at **King Saud University (KSU)**: calculus, linear algebra, discrete mathematics and more. For a long time these felt like separate courses to pass. Then I read [The Roadmap of Mathematics for Machine Learning](https://thepalindrome.org/p/the-roadmap-of-mathematics-for-machine-learning) by **Tivadar Danka** (The Palindrome), and the pieces started to connect.

His main idea is simple: machine learning stands on **three pillars**.

- **Linear algebra** describes the model.
- **Calculus** fits the model to the data.
- **Probability theory** ties it together, so the model can make predictions under uncertainty.

In this article I follow his roadmap step by step (it gives multivariable calculus its own stage, between the pillars), and point to the KSU courses where I met each topic. My study notes for those courses are public on GitHub, so you can use them too.

He also gives one piece of advice that I like a lot: don't read the roadmap in one sitting. Go deep into one concept, come back, and move on. In his words, *"I will show you the road, but you must walk it."*

## 1. Linear algebra

A neural network is a function, but it is **described** with linear algebra. A fully connected layer, for example, multiplies its input by a weight matrix, adds a bias vector and applies an activation function: `f(x) = σ(Wx + b)`. Other layer types are built from the same matrix and vector operations. The roadmap says that for engineers working on real problems, linear algebra is the most important topic of all.

The order it suggests:

1. **Vectors and vector spaces.** Think of vectors as arrows from the origin that you can add and scale.
2. **Normed spaces.** How to measure length and distance: the Euclidean norm (Pythagoras in disguise), the Manhattan norm, and inner products, which also tell you when two vectors are **orthogonal**.
3. **Basis.** A small set of vectors that can build every other vector, and orthonormal bases, which make everything simpler.
4. **Linear transformations.** Functions like rotations that keep addition and scaling. The `Wx` in a neural network layer is one.
5. **Matrices.** Matrix multiplication is defined the way it is because it **composes** linear transformations.
6. **Determinants.** How much a transformation scales volume, and whether it flips orientation.
7. **Eigenvalues, eigenvectors and decompositions.** When `Ax = λx`, the matrix just scales `x`. The **singular value decomposition (SVD)** is behind **PCA**, a classic way to reduce dimensions.

This is the subject of my **MATH 244 Linear Algebra** course. My notes, slides, quizzes and old homework are in the [MATH244 repository](https://github.com/PYTHON01100100/MATH244-Linear-Algebra-_44_KSU).

## 2. Calculus

Training a neural network means minimizing a loss function, and calculus is how we do it. (Common activations like ReLU have a corner at zero where the derivative is not defined. Frameworks simply use the derivative from one side there, so training still works.)

- **The derivative** is the slope of the tangent line. At a local minimum or maximum inside the domain, the derivative of a differentiable function is zero, so optimization starts by looking at those points. But a zero derivative alone does not prove a minimum or maximum: `f(x) = x³` has `f′(0) = 0` at a point that is neither.
- **The second derivative** helps classify such a point: if `f′(x) = 0` and `f″(x) > 0`, it is a local minimum; if `f″(x) < 0`, a local maximum. If `f″(x) = 0` too, the test is inconclusive: `x⁴` has a minimum at 0 and `x³` has none, but both have `f″(0) = 0`.
- **The chain rule** gives the derivative of composed functions. It matters because a neural network is a long chain of composed functions.
- **Integration** is the area under a curve. It comes back later in probability: for continuous distributions, expected values and the KL divergence are integrals over a density.

My calculus summaries are in the [MATH_ksu repository](https://github.com/PYTHON01100100/MATH_ksu), which is also where my KSU math started. My **MATH 106 / MATH 111** integral calculus notes are in [KSU_MATH_111_106_INTEGRAL_CALCULUS](https://github.com/PYTHON01100100/KSU_MATH_111_106_INTEGRAL_CALCULUS).

## 3. Multivariable calculus

This is where linear algebra and calculus meet, and where **gradient descent** comes from. A neural network is a function of many variables, sometimes millions.

- **Partial derivatives** measure the change along one variable at a time.
- **The gradient** collects them into one vector that points in the direction of the steepest increase.
- **Gradient descent** follows it the other way: compute the gradient, take a small step against it (the step size is the **learning rate**), and repeat.
- **The multivariable chain rule** is what makes it possible to compute the gradient of a whole network, layer by layer.
- **The Hessian** (the matrix of all second derivatives) describes the local curvature. At a point where the gradient is zero, all-positive eigenvalues mean a local minimum, all-negative ones a local maximum, and a mix of positive and negative a **saddle point**. When some eigenvalues are zero, the test can be inconclusive.

The roadmap treats this as its own stage, after single-variable calculus and linear algebra. It only works once both are solid.

### A worked example: one step of gradient descent

Here is the whole idea on the smallest possible model, `ŷ = wx + b`, with one training example: `x = 2` and the correct answer `y = 4`. To keep it simple, `b` is fixed at `0`, so only `w` learns. We start at `w = 0`.

```text
Prediction:  ŷ = w·2 + 0 = 2w                 at w = 0:  ŷ = 0
Loss:        L(w) = (ŷ − y)² = (2w − 4)²       at w = 0:  L = (−4)² = 16
Derivative:  dL/dw = 2(2w − 4)·2 = 4(2w − 4)   at w = 0:  dL/dw = −16
Update:      w ← w − η·dL/dw = 0 − 0.1·(−16) = 1.6   (learning rate η = 0.1)
New loss:    L(1.6) = (3.2 − 4)² = (−0.8)² = 0.64
```

In plain English: the model predicts `0` instead of `4`, and the squared error turns that into a loss of `16`. The derivative is negative, which means increasing `w` lowers the loss. The update takes a step in that direction, scaled by the learning rate `η`, and the loss drops from `16` to `0.64`.

The learning rate matters. With `η = 0.5`, the same step gives `w = 0 − 0.5·(−16) = 8` and a loss of `(16 − 4)² = 144`, far worse than where we started. For this loss, any `η` above `0.25` overshoots so much that the loss grows at every step. A gradient step only lowers the loss when the step is small enough.

A real network does the same thing with millions of weights instead of one, and the chain rule computes every derivative.

## 4. Probability theory

Probability is the mathematics of chance, and it is the language of predictions.

- **Probability** is a function from events (sets) to numbers between 0 and 1.
- **Conditional probability** and **Bayes' theorem** show how an observation changes a probability, for example how the word "deal" makes an email more likely to be spam.
- **Expected value** is the probability-weighted average. It is a sum over outcomes for a discrete distribution, and an integral over the density for a continuous one. The training loss is usually an average over the training examples, which estimates an expected loss.
- **The law of large numbers** says the average of many independent samples approaches the expected value. That is why an average over a random sample is a reasonable estimate of the whole.
- **Stochastic gradient descent (SGD)** builds on the same idea: it estimates the gradient from a randomly sampled example or mini-batch instead of the whole dataset. If the examples are drawn independently from the data distribution, the estimate is unbiased, meaning it is right on average. That alone does not guarantee convergence: it also needs assumptions about the loss and a suitable learning rate, usually one that decreases over time.
- **Information theory:** entropy measures the uncertainty in a distribution. For discrete distributions, entropy, the **cross-entropy loss** used in classification and the **KL divergence** are sums over outcomes. For continuous distributions they become integrals, but the continuous version of entropy, called **differential entropy**, behaves differently (it can even be negative), so the two are not interchangeable.

My courses here don't map one to one to a single repository, but discrete mathematics gave me the base: events are sets, so set operations and counting are the language of probability. I studied it in **MATH 151** ([MATH151 repository](https://github.com/PYTHON01100100/KSU_MATH151_Discrete_Mathematics)) and again from the computer science side in **CSC 281** ([CSC-281 repository](https://github.com/PYTHON01100100/KSU_CSC_281_Discrete_Mathematics_for_CS)). For probability and statistics themselves, the third course of the specialization I recommend below covers them directly.

## How my courses map to the roadmap

| Roadmap step | My KSU courses | Notes on GitHub |
|---|---|---|
| Linear algebra | MATH 244 | [MATH244](https://github.com/PYTHON01100100/MATH244-Linear-Algebra-_44_KSU) |
| Calculus | Calculus, MATH 106 / 111 | [MATH_ksu](https://github.com/PYTHON01100100/MATH_ksu), [KSU_MATH_111_106_INTEGRAL_CALCULUS](https://github.com/PYTHON01100100/KSU_MATH_111_106_INTEGRAL_CALCULUS) |
| Multivariable calculus | Builds on calculus and linear algebra | the two rows above |
| Probability (foundations) | MATH 151, CSC 281 (discrete math) | [MATH151](https://github.com/PYTHON01100100/KSU_MATH151_Discrete_Mathematics), [CSC-281](https://github.com/PYTHON01100100/KSU_CSC_281_Discrete_Mathematics_for_CS) |

## Where to study further

You don't need all of these. For each area, begin with the **start here** resource, and use the others only if it doesn't click or you want more. Resources marked *(roadmap)* are the ones Tivadar Danka's roadmap recommends; the rest are my additions.

**Linear algebra**

- **Start here:** [MIT 18.06 Linear Algebra, Spring 2005](https://www.youtube.com/playlist?list=PLE7DDD91010BC51F8) with Gilbert Strang, from MIT OpenCourseWare *(roadmap)*.
- **More applied:** [Stanford ENGR108: Introduction to Applied Linear Algebra](https://www.youtube.com/playlist?list=PLoROMvodv4rMz-WbFQtNUsUElIh2cPmN9): vectors, matrices and least squares.
- **Deeper, more proof-based:** *Linear Algebra Done Right* by Sheldon Axler *(roadmap)*.
- **In Arabic, with Python:** [الجبر الخطي في التعلم الآلي](https://www.youtube.com/playlist?list=PL-2-nnWlNR_B4stbIh70Ldee3SGPB2mrg) (Linear Algebra in Machine Learning) by Riyadh Haitham, or [الجبر الخطي Linear Algebra](https://www.youtube.com/playlist?list=PL2jXoCmw1KK0uwF74vMx-w6hITlrMHeVD) by Rasool Hasan.

**Calculus**

- **Start here:** [MIT 18.01 Single Variable Calculus, Fall 2006](https://www.youtube.com/playlist?list=PL590CCC2BC5AF3BC1) *(roadmap)*.
- **To read:** Gilbert Strang's free *Calculus* book *(roadmap)*, or [Paul's Online Notes](https://tutorial.math.lamar.edu/) for notes and worked examples.
- **Other styles:** [ValsCalc](https://valscalc.com/) for short visual lessons, [Professor Leonard's Calculus 1](https://www.youtube.com/playlist?list=PLF797E961509B4EB5) for full-length classroom lectures, or freeCodeCamp's [Calculus 1 - Full College Course](https://youtu.be/HfACrKJ_Y2w) in one video.
- **To look things up:** [Androma](https://androma.org/search?type=page), a searchable math wiki of theorems, proofs and definitions.

**Multivariable calculus**

- **Start here:** [MIT 18.02 Multivariable Calculus, Fall 2007](https://www.youtube.com/playlist?list=PL4C4C8A7D06566F38) *(roadmap)*.
- **Alternative:** [Khan Academy](https://www.youtube.com/@khanacademy) *(roadmap)*.

**Probability**

- **Start here:** MIT's *Introduction to Probability* by John Tsitsiklis *(roadmap)*.

**Everything in one place:** Tivadar Danka's book *The Mathematics of Machine Learning* *(roadmap)*.

**My recommendation:** if you want one structured course to prepare for the math of AI, I recommend the [Mathematics for Machine Learning and Data Science](https://www.coursera.org/specializations/mathematics-for-machine-learning-and-data-science) specialization by **DeepLearning.AI** on Coursera, taught by **Luis Serrano**. Its three courses match this roadmap closely:

- **Linear Algebra for Machine Learning and Data Science** (about 34 hours)
- **Calculus for Machine Learning and Data Science** (about 27 hours)
- **Probability & Statistics for Machine Learning & Data Science** (about 33 hours)

Note that it is a **paid** course, with a career certificate at the end.

## Conclusion

University math courses can feel disconnected while you take them. Seen through this roadmap, they are not: linear algebra gives a model its shape, calculus trains it, and probability explains what its predictions mean. If you are a student at KSU or anywhere else, my notes are open, so take what helps you, and walk the road one concept at a time.

## References

- [The Roadmap of Mathematics for Machine Learning](https://thepalindrome.org/p/the-roadmap-of-mathematics-for-machine-learning) by Tivadar Danka, The Palindrome
- [Mathematics for Machine Learning and Data Science](https://www.coursera.org/specializations/mathematics-for-machine-learning-and-data-science) by DeepLearning.AI on Coursera (paid): linear algebra, calculus, and probability & statistics
- [The Deep Learning Road Map That I Took](https://medium.com/@ArianAmani/the-deep-learning-road-map-that-i-took-c29120b0f5e2) by Arian Amani on Medium: another learning path toward deep learning
- [MATH 244 Linear Algebra (KSU)](https://github.com/PYTHON01100100/MATH244-Linear-Algebra-_44_KSU): notes, slides, quizzes and old homework
- [MATH 151 (KSU)](https://github.com/PYTHON01100100/KSU_MATH151_Discrete_Mathematics): discrete mathematics, with summaries and exams
- [CSC 281 (KSU)](https://github.com/PYTHON01100100/KSU_CSC_281_Discrete_Mathematics_for_CS): discrete mathematics for computer science
- [MATH_ksu](https://github.com/PYTHON01100100/MATH_ksu): calculus summaries, where my KSU math started (including MATH 106 / 111)
- [KSU_MATH_111_106_INTEGRAL_CALCULUS](https://github.com/PYTHON01100100/KSU_MATH_111_106_INTEGRAL_CALCULUS): MATH 106 / 111, integral calculus
- [ValsCalc](https://valscalc.com/): free, accessible calculus lessons
- [Paul's Online Notes](https://tutorial.math.lamar.edu/) by Paul Dawkins (Lamar University): free notes for algebra, calculus I to III and differential equations
- [Androma](https://androma.org/search?type=page): a collaborative math wiki and study platform for theorems, proofs and definitions
- [MIT 18.06 Linear Algebra, Spring 2005](https://www.youtube.com/playlist?list=PLE7DDD91010BC51F8) by MIT OpenCourseWare, with Gilbert Strang
- [Gilbert Strang lectures on Linear Algebra (MIT)](https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D): another playlist of the same lecturer
- [Stanford ENGR108: Introduction to Applied Linear Algebra](https://www.youtube.com/playlist?list=PLoROMvodv4rMz-WbFQtNUsUElIh2cPmN9) by Stanford Online: vectors, matrices and least squares
- [MIT 18.01 Single Variable Calculus, Fall 2006](https://www.youtube.com/playlist?list=PL590CCC2BC5AF3BC1) by MIT OpenCourseWare
- [MIT 18.02 Multivariable Calculus, Fall 2007](https://www.youtube.com/playlist?list=PL4C4C8A7D06566F38) by MIT OpenCourseWare
- [Calculus 1 (Full Length Videos)](https://www.youtube.com/playlist?list=PLF797E961509B4EB5) by Professor Leonard
- [Calculus 1 - Full College Course](https://youtu.be/HfACrKJ_Y2w) by freeCodeCamp.org
- [الجبر الخطي في التعلم الآلي](https://www.youtube.com/playlist?list=PL-2-nnWlNR_B4stbIh70Ldee3SGPB2mrg) (Linear Algebra in Machine Learning) by Riyadh Haitham: in Arabic, with Python
- [الجبر الخطي Linear Algebra](https://www.youtube.com/playlist?list=PL2jXoCmw1KK0uwF74vMx-w6hITlrMHeVD) by Rasool Hasan: in Arabic, with Python
- [Khan Academy](https://www.youtube.com/@khanacademy) on YouTube

Optional: more full lecture courses, if you want to go further:

- [Student Lectures - Linear Algebra](https://www.youtube.com/playlist?list=PL4d5ZtfQonW3OCE1lEmYS-6d7LEDz8zby) by Oxford Mathematics
- [Oxford Calculus](https://www.youtube.com/playlist?list=PLMCRxGutHqflZoTY8JCm1GRzCdGXvZ3_S) by Tom Rocks Maths
- [Lectures - Mathematics](https://www.youtube.com/playlist?list=PL1D3EF3169B3E7CB2) by the University of Oxford
- [Math 2B: Calculus](https://www.youtube.com/playlist?list=PLqOZ6FD_RQ7mxsWrqTwndCBFXAKC0Xho9) by UCI Open
- [Introduction to Probability and Statistics 131B](https://www.youtube.com/playlist?list=PLqOZ6FD_RQ7k-j-86QUC2_0nEu0QOP-Wy) by UCI Open
- [Mathematical Statistics I (Course 481)](https://www.youtube.com/playlist?list=PL9520222F814EE9B6) by UCCS MathOnline
- [MIT 6.042J Mathematics for Computer Science, Fall 2010](https://www.youtube.com/playlist?list=PLB7540DEDD482705B) by MIT OpenCourseWare: discrete math and probability for computer science
- [MIT Mathematics](https://www.youtube.com/playlist?list=PLm0X8hqw4lIotQB9ep0MKVkT2447Lk2ue): a playlist of MIT math lectures, collected by Hassan Ahmadi
- [Math 70 Beginning Algebra](https://www.youtube.com/playlist?list=PL367nn10rv0sBKcmndvD9sqBbftcE5udD) by California Community Colleges: if you need to refresh basic algebra first
