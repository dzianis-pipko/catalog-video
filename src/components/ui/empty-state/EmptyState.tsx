import Button from '@/components/ui/button/Button';

interface EmptyStateProps {
  message: string;
  buttonText: string;
  onClick: () => void;
  buttonAriaLabel: string;
  textColor?: string;
}

export const EmptyState = ({
  message,
 buttonText,
  onClick,
  buttonAriaLabel,
  textColor = 'text-gray-300 dark:text-text-secondary',
}: EmptyStateProps) => {
  return (
    <div className="col-span-full text-center py-12 transition-opacity duration-300">
      <p className={`mb-4 ${textColor}`}>{message}</p>
      <Button
        onClick={onClick}
        ariaLabel={buttonAriaLabel}
      >
        {buttonText}
      </Button>
    </div>
  );
};