import { describe, it, expect } from 'vitest';
import { 
  SimpleRiskStrategy, 
  WeightedRiskStrategy,
  RiskEvaluator 
} from '@/strategies/RiskEvaluationStrategy';

describe('RiskEvaluationStrategy', () => {
  describe('SimpleRiskStrategy', () => {
    it('should calculate risk as impact * likelihood', () => {
      const strategy = new SimpleRiskStrategy();
      expect(strategy.evaluate(4, 3)).toBe(12);
    });
  });

  describe('WeightedRiskStrategy', () => {
    it('should calculate risk with weighted formula', () => {
      const strategy = new WeightedRiskStrategy();
      expect(strategy.evaluate(4, 3)).toBeCloseTo(3.7, 2);
    });
  });

  describe('RiskEvaluator', () => {
    it('should use the provided strategy', () => {
      const evaluator = new RiskEvaluator(new SimpleRiskStrategy());
      expect(evaluator.evaluateRisk(4, 3)).toBe(12);
    });

    it('should allow changing strategies', () => {
      const evaluator = new RiskEvaluator(new SimpleRiskStrategy());
      evaluator.setStrategy(new WeightedRiskStrategy());
      expect(evaluator.evaluateRisk(4, 3)).toBeCloseTo(3.7, 2);
    });
  });
});