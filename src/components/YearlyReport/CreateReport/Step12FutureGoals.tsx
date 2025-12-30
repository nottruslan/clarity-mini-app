import Step3LifeAreas from './Step3LifeAreas';
import { type FutureYearData } from '../../../utils/storage';

interface Step12FutureGoalsProps {
  onNext: (lifeAreas: FutureYearData['lifeAreas']) => void;
  onBack: () => void;
  initialData?: FutureYearData['lifeAreas'];
}

export default function Step12FutureGoals(props: Step12FutureGoalsProps) {
  return <Step3LifeAreas {...props} isFuture={true} />;
}

