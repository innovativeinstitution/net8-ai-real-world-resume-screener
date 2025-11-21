using System.Data.Common;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Core.Infrastructure.Db;

public interface IDbConnectionFactory
{
    Task<DbConnection> CreateOpenConnectionAsync();
}

public class NpgsqlConnectionFactory : IDbConnectionFactory
{
    private readonly string _connectionString;

    public NpgsqlConnectionFactory(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Missing ConnectionStrings:Default");
    }

    public async Task<DbConnection> CreateOpenConnectionAsync()
    {
        var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();
        return conn;
    }
}
