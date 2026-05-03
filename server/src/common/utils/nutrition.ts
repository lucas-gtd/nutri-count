import { ActivityLevel } from '../../profile/profile.entity';

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: string,
): number {
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

const activityMultipliers: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.ACTIVE]: 1.725,
  [ActivityLevel.VERY_ACTIVE]: 1.9,
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * activityMultipliers[activityLevel];
}

export function calculateTEF(totalCaloriesIngested: number): number {
  return totalCaloriesIngested * 0.1;
}

export function calculateRemainingCalories(
  tdee: number,
  caloriesExercise: number,
  caloriesIngested: number,
  tef: number,
): number {
  return tdee + caloriesExercise - caloriesIngested - tef;
}
