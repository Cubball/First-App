using FluentValidation;

namespace TaskBoard.BLL.Validation.Common;

public static class PriorityValidatorExtensions
{
    private static readonly string[] AllowedPriorities = ["Low", "Medium", "High"];

    private static readonly string ErrorMessage = $"The provided priority is not valid, allowed priorities are: {string.Join(", ", AllowedPriorities)}";

    public static IRuleBuilderOptions<T, string> ValidPriority<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        return ruleBuilder
            .Must(p => AllowedPriorities.Contains(p))
            .WithMessage(ErrorMessage);
    }
}