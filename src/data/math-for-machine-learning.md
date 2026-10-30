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

Publish date: `2024-09-01`

# The Math Behind Machine Learning: My Roadmap from KSU Courses

Since 2021 I have been studying mathematics at **King Saud University (KSU)**: calculus, linear algebra, discrete mathematics and more. For a long time these felt like separate courses to pass. Then I read [The Roadmap of Mathematics for Machine Learning](https://thepalindrome.org/p/the-roadmap-of-mathematics-for-machine-learning) by **Tivadar Danka** (The Palindrome), and the pieces started to connect.

His main idea is simple: machine learning stands on **three pillars**.

- **Linear algebra** describes the model.
- **Calculus** fits the model to the data.
- **Probability theory** ties it together, so the model can make predictions under uncertainty.

In this article I follow his roadmap step by step (it gives multivariable calculus its own stage, between the pillars), and point to the KSU courses where I met each topic. My study notes for those courses are public on GitHub, so you can use them too.

He also gives one piece of advice that I like a lot: don't read the roadmap in one sitting. Go deep into one concept, come back, and move on. In his words, *"I will show you the road, but you must walk it."*

## 1. Linear algebra

A neural network is a function, but it is **described** with linear algebra: every layer is a matrix multiplication plus a vector, `f(x) = σ(Ax + b)`. The roadmap says that for engineers working on real problems, linear algebra is the most important topic of all.

The order it suggests:

1. **Vectors and vector spaces.** Think of vectors as arrows from the origin that you can add and scale.
2. **Normed spaces.** How to measure length and distance: the Euclidean norm (Pythagoras in disguise), the Manhattan norm, and inner products, which also tell you when two vectors are **orthogonal**.
3. **Basis.** A small set of vectors that can build every other vector, and orthonormal bases, which make everything simpler.
4. **Linear transformations.** Functions like rotations that keep addition and scaling. The `Ax` in a neural network layer is one.
5. **Matrices.** Matrix multiplication is defined the way it is because it **composes** linear transformations.
6. **Determinants.** How much a transformation scales volume, and whether it flips orientation.
7. **Eigenvalues, eigenvectors and decompositions.** When `Ax = λx`, the matrix just scales `x`. The **singular value decomposition (SVD)** is behind **PCA**, a classic way to reduce dimensions.

This is the subject of my **MATH 244 Linear Algebra** course. My notes, slides, quizzes and old homework are in the [MATH244 repository](https://github.com/PYTHON01100100/MATH244-Linear-Algebra-_44_KSU).

## 2. Calculus

A neural network is a **differentiable** function, and calculus is how we train it.

- **The derivative** is the slope of the tangent line. It is zero at minimums and maximums, which is the starting point of optimization.
- **The second derivative** tells you whether a critical point is a minimum or a maximum.
- **The chain rule** gives the derivative of composed functions. It matters because a neural network is a long chain of composed functions.
- **Integration** is the area under a curve. It comes back later in probability, because expected value, entropy and the KL divergence are all defined with integrals.

My calculus summaries are in the [MATH_ksu repository](https://github.com/PYTHON01100100/MATH_ksu), which is also where my KSU math started. The algebra and equations foundation from **MATH 106 / MATH 111** is in [KSU_MATH_111_106](https://github.com/PYTHON01100100/KSU_MATH_111_106).

## 3. Multivariable calculus

This is where linear algebra and calculus meet, and where **gradient descent** comes from. A neural network is a function of many variables, sometimes millions.

- **Partial derivatives** measure the change along one variable at a time.
- **The gradient** collects them into one vector that points in the direction of the steepest increase.
- **Gradient descent** follows it the other way: compute the gradient, take a small step against it (the step size is the **learning rate**), and repeat.
- **The multivariable chain rule** is what makes it possible to compute the gradient of a whole network, layer by layer.
- **The Hessian** (all second derivatives) tells you whether a critical point is a minimum, a maximum or a saddle point.

The roadmap treats this as its own stage, after single-variable calculus and linear algebra. It only works once both are solid.

## 4. Probability theory

Probability is the mathematics of chance, and it is the language of predictions.

- **Probability** is a function from events (sets) to numbers between 0 and 1.
- **Conditional probability** and **Bayes' theorem** show how an observation changes a probability, for example how the word "deal" makes an email more likely to be spam.
- **Expected value** is the long-run average. Loss functions in machine learning are expected values in one way or another.
- **The law of large numbers** says the average of many repetitions approaches the expected value. It is what makes stochastic gradient descent work.
- **Information theory**: entropy measures the information in a distribution, and the **cross-entropy loss** used in classification, and the **KL divergence**, both come from it.

My courses here don't map one to one to a single repository, but discrete mathematics gave me the base: events are sets, so set operations and counting are the language of probability. I studied it in **MATH 151** ([MATH151 repository](https://github.com/PYTHON01100100/MATH151_43_SEC_TERM_22)) and again from the computer science side in **CSC 281** ([CSC-281 repository](https://github.com/PYTHON01100100/CSC-281_KSU_44)).

## How my courses map to the roadmap

| Roadmap step | My KSU courses | Notes on GitHub |
|---|---|---|
| Linear algebra | MATH 244 | [MATH244](https://github.com/PYTHON01100100/MATH244-Linear-Algebra-_44_KSU) |
| Calculus | Calculus, MATH 106 / 111 | [MATH_ksu](https://github.com/PYTHON01100100/MATH_ksu), [KSU_MATH_111_106](https://github.com/PYTHON01100100/KSU_MATH_111_106) |
| Multivariable calculus | Builds on calculus and linear algebra | the two rows above |
| Probability (foundations) | MATH 151, CSC 281 (discrete math) | [MATH151](https://github.com/PYTHON01100100/MATH151_43_SEC_TERM_22), [CSC-281](https://github.com/PYTHON01100100/CSC-281_KSU_44) |

## Where to study further

The roadmap recommends these for each pillar:

- **Linear algebra:** *Linear Algebra Done Right* by Sheldon Axler, and the Linear Algebra course on MIT OpenCourseWare.
- **Calculus:** MIT's Single Variable Calculus course and Gilbert Strang's *Calculus* book, which is free.
- **Multivariable calculus:** MIT's Multivariable Calculus course and Khan Academy.
- **Probability:** MIT's *Introduction to Probability* by John Tsitsiklis.
- **Everything in one place:** Tivadar Danka's book *The Mathematics of Machine Learning*.

## Conclusion

University math courses can feel disconnected while you take them. Seen through this roadmap, they are not: linear algebra gives a model its shape, calculus trains it, and probability explains what its predictions mean. If you are a student at KSU or anywhere else, my notes are open, so take what helps you, and walk the road one concept at a time.

## References

- [The Roadmap of Mathematics for Machine Learning](https://thepalindrome.org/p/the-roadmap-of-mathematics-for-machine-learning) by Tivadar Danka, The Palindrome
- [The Deep Learning Road Map That I Took](https://medium.com/@ArianAmani/the-deep-learning-road-map-that-i-took-c29120b0f5e2) by Arian Amani on Medium: another learning path toward deep learning
- [MATH 244 Linear Algebra (KSU)](https://github.com/PYTHON01100100/MATH244-Linear-Algebra-_44_KSU): notes, slides, quizzes and old homework
- [MATH 151 (KSU)](https://github.com/PYTHON01100100/MATH151_43_SEC_TERM_22): discrete mathematics, with summaries and exams
- [CSC 281 (KSU)](https://github.com/PYTHON01100100/CSC-281_KSU_44): discrete mathematics for computer science
- [MATH_ksu](https://github.com/PYTHON01100100/MATH_ksu): calculus summaries, where my KSU math started (including MATH 106 / 111)
- [KSU_MATH_111_106](https://github.com/PYTHON01100100/KSU_MATH_111_106): MATH 106 / 111, algebra and equations
