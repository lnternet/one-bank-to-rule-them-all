namespace OneBankToRuleThemAllAPI.Models;

public class Configurations
{
    public string[] transactionTypes { get => System.Enum.GetNames( typeof( TransactionType ) );  }

    public string[] spendingCategories { get => System.Enum.GetNames( typeof( SpendingCategory ) );  }
}
