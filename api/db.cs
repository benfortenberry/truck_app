namespace TruckAppStore.DB;

public record Expense
{
  public int Id { get; set; }
  public decimal? Amount { get; set; }
  public DateOnly? Date { get; set; }

  public int? TypeId { get; set; }

  public string? Description { get; set; }



}


public record ExpenseType
{
  public int Id { get; set; }
  public string? Name { get; set; }
}
public class ExpenseDB
{
  private static List<Expense> _expenses = new List<Expense>()
   {
     new Expense{ Id=1, Amount=243.40m, Date=DateOnly.Parse("2025-03-22"), TypeId=1, Description="Fuel for the truck"},
      new Expense{ Id=2, Amount=150.20m, Date=DateOnly.Parse("2025-4-1"), TypeId=2, Description="Oil change"},
      new Expense{ Id=3, Amount=300.10m, Date=DateOnly.Parse("2025-1-26"), TypeId=3, Description="Causeway Bridge"},


   };

  private static List<ExpenseType> _expenseTypes = new List<ExpenseType>()
    {
      new ExpenseType{ Id=1, Name="Fuel"},
      new ExpenseType{ Id=2, Name="Maintenance"},
      new ExpenseType{ Id=3, Name="Tolls"},
      new ExpenseType{ Id=4, Name="Lodging"},
      new ExpenseType{ Id=5, Name="Meals"}
    };

  public static List<Expense> GetExpenses()
  {
    return _expenses;
  }

  public static List<ExpenseType> GetExpenseTypes()
  {
    return _expenseTypes;
  }
  public static Expense CreateExpense(Expense expense)
  {
    _expenses.Add(expense);
    return expense;
  }

  public static Expense UpdateExpense(Expense update)
  {
    _expenses = _expenses.Select(expense =>
    {
      if (expense.Id == update.Id)
      {
        expense.Amount = update.Amount;
        expense.Date = update.Date;
        expense.TypeId = update.TypeId;
        expense.Description = update.Description;
      }
      return expense;
    }).ToList();
    return update;
  }

  public static void RemoveExpense(int id)
  {
    _expenses = _expenses.FindAll(expense => expense.Id != id).ToList();
  }
}