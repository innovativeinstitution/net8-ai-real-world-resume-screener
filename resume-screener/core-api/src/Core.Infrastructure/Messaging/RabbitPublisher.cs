using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;

namespace Core.Infrastructure.Messaging;

public interface IRabbitPublisher
{
    void Publish(string exchange, string routingKey, string messageBody);
}

public class RabbitPublisher : IRabbitPublisher, IDisposable
{
    private readonly ILogger<RabbitPublisher> _logger;
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public RabbitPublisher(IConfiguration config, ILogger<RabbitPublisher> logger)
    {
        _logger = logger;
        var url = config["Rabbit:Url"] ?? throw new InvalidOperationException("Missing Rabbit:Url");
        var factory = new ConnectionFactory { Uri = new Uri(url) };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        _channel.QueueDeclare(queue: "resume.parse", durable: true, exclusive: false, autoDelete: false);
        _channel.QueueDeclare(queue: "rank.refresh", durable: true, exclusive: false, autoDelete: false);
    }


    public void Publish(string exchange, string routingKey, string messageBody)
    {
        var body = Encoding.UTF8.GetBytes(messageBody);
        _channel.BasicPublish(exchange: exchange, routingKey: routingKey, basicProperties: null, body: body);
        _logger.LogInformation("Published message to {Exchange} with key {RoutingKey}", exchange, routingKey);
    }

    public void Dispose()
    {
        if (_channel.IsOpen) _channel.Close();
        _channel.Dispose();
        _connection.Dispose();
    }
}
