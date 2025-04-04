export class CreateRatingDto {
  orderId: string;
  userId: string;
  deliveryAgentId: string;
  ratingValue: number;
  comment?: string;
}
