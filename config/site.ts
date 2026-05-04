/**
 * Site configuration and metadata
 */

export const siteConfig = {
  title: 'HCSN Theory',
  description:
    'A pre-geometric framework where spacetime, particles, and dynamics emerge from local rewrite processes in discrete causal networks.',
  author: 'HCSN Research',
  url: 'https://hcsn-theory.research',
  socialLinks: {
    github: 'https://github.com/yourusername/hcsn-theory',
    email: 'contact@hcsn-theory.research',
  },
  disclaimer:
    'Exploratory, simulation-driven research. No assumed correspondence with established physical theories.',
};

export const documentationItems = [
  {
    id: 'axioms',
    title: 'Axioms and Methodology',
    description:
      'Minimal axiom set and methodological principles underlying HCSN.',
    status: 'Stable',
    link: '/docs/01_axioms_and_methodology',
  },
  {
    id: 'defects',
    title: 'Defects, Worldlines, and Particles',
    description: 'Emergent objects and operational identity definitions.',
    status: 'Empirical',
    link: '/docs/02_defects_worldlines_and_particles',
  },
  {
    id: 'dynamics',
    title: 'Emergent Dynamics, Momentum, and Interaction',
    description: 'Motion, momentum, mass, and interaction without spacetime.',
    status: 'Empirical',
    link: '/docs/03_emergent_dynamics_momentum_and_interaction',
  },
  {
    id: 'geometry',
    title: 'Geometry, Dimension, Uncertainty, and Limits',
    description:
      'Large-scale structure, phase transitions, and theory boundaries.',
    status: 'In Progress',
    link: '/docs/04_geometry_dimension_uncertainty_and_limits',
  },
  {
    id: 'emergence',
    title: 'Emergence of Particles',
    description: 'Mechanics of matter condensation: pillars, nucleation, and scaling.',
    status: 'Validated',
    link: '/docs/05_emergence_of_particles',
  },
];

export const coreIdeas = [
  {
    title: 'Discrete Causal Networks',
    description:
      'Spacetime is not fundamental. Causality emerges from discrete events and local relations.',
  },
  {
    title: 'Local Rewrite Dynamics',
    description:
      'Evolution proceeds through probabilistic local transformations that preserve causal consistency.',
  },
  {
    title: 'Emergence Over Assumption',
    description:
      'Particles, geometry, and forces arise from rewrite statistics—not postulated.',
  },
  {
    title: 'Order Parameter γ & Ω',
    description:
      'Hierarchical closure (Ω) and non-linear coupling (γ) regulate structure. The phase transition to matter is multi-dimensional.',
  },
  {
    title: 'Transport Without Geometry',
    description:
      'Persistent information flow (ξ activity) can exist before geometric structure emerges.',
  },
  {
    title: 'Operational Definitions',
    description:
      'All physical quantities are defined operationally from rewrite histories and measurements.',
  },
  {
    title: 'Topological Force Law',
    description:
      'Interaction is non-zero iff structural overlap $\chi > 0.14$. Strength follows $F \sim k/\chi$ with coupling $k=182.1$.',
  },
];

export const roadmapItems = [
  {
    phase: 'Phase 1–10',
    title: 'Foundation & Simulation',
    status: 'Completed',
    description: 'Axioms, rewrite rules, initial simulation validation.',
  },
  {
    title: 'Phase Transitions & Criticality',
    status: 'Completed',
    description:
      'Discovery of multi-dimensional criticality. Corrected earlier monotonic phase claims via γ-sweeps.',
  },
  {
    phase: 'Phase 12–16',
    title: 'Rigorous Validation (v3.1)',
    status: 'Completed',
    description:
      'Empirical proof of Partial Correlation Collapse (53.5%) and Robust Universality (100% Volume in Control mode).',
  },
  {
    phase: 'Phase 17+',
    title: 'Fragile Emergent Conservation',
    status: 'Current',
    description:
      'Observation of approximate momentum conservation (ρ = -0.47) emerging naturally from topology without axiomatic patches.',
  },
  {
    phase: 'Future',
    title: 'Dimensional Selection & Continuum',
    status: 'Planned',
    description:
      'Large-scale dimension stabilization, exact invariance principles, and formalizing the statistical limits.',
  },
];
