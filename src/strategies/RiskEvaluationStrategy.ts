export interface RiskEvaluationStrategy {
  evaluate(impact: number, likelihood: number): number;
}

export class SimpleRiskStrategy implements RiskEvaluationStrategy {
  evaluate(impact: number, likelihood: number): number {
    return impact * likelihood;
  }
}

export class WeightedRiskStrategy implements RiskEvaluationStrategy {
  evaluate(impact: number, likelihood: number): number {
    return (impact * 0.7) + (likelihood * 0.3);
  }
}

export class RiskEvaluator {
  private strategy: RiskEvaluationStrategy;

  constructor(strategy: RiskEvaluationStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: RiskEvaluationStrategy) {
    this.strategy = strategy;
  }

  evaluateRisk(impact: number, likelihood: number): number {
    return this.strategy.evaluate(impact, likelihood);
  }
}