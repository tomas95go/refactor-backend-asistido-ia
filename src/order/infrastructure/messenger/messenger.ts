import { Order } from "../../domain/aggregate/order";
import {Messenger} from "../../domain/messenger/messenger";
import {Client, LibraryResponse, SendEmailV3_1} from "node-mailjet";

export class MailjetMessenger implements Messenger {
    constructor(private readonly mailjetClient: Client) {}

    static create(mailjetClient: Client): Messenger {
        return new MailjetMessenger(mailjetClient);
    }

    async send(data: { to: string; order: Order; }): Promise<string> {
        const body: SendEmailV3_1.Body = {
            Messages: [
                {
                    From: {
                        Email: 'pilot@test.com',
                    },
                    To: [
                        {
                            Email: data.to,
                        },
                    ],
                    Subject: 'Your email flight plan!',
                    HTMLPart: '<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!',
                    TextPart: 'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
                },
            ],
        }
        await this.mailjetClient.post('send', { version: 'v3.1' }).request(body);
        return `Your order: ${data.order.toDto().id} has been completed!`
    }

}