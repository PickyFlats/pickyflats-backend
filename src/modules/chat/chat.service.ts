import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './schemas/conversation.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async fetchUserConversationBetweenAB(a, b) {
    const searchConnection = await this.conversationModel.findOne({
      ...(a !== b && {
        $or: [
          { participants: { $eq: [a, b] } },
          { participants: { $eq: [b, a] } },
        ],
      }),
      ...(a == b && { participants: { $eq: [a] } }),
    });
    if (searchConnection) return searchConnection;
    return false;
  }

  async createConnection(createConnectionDto: CreateConnectionDto) {
    // check for connection exits between participants and return already existed if present
    const [a, b] = createConnectionDto.participants;
    const existConnection = await this.fetchUserConversationBetweenAB(a, b);
    if (existConnection) return existConnection.id;

    // create connection
    const newConnection = await this.conversationModel.create(
      createConnectionDto,
    );
    return newConnection.id;
  }

  async fetchConversationsByUserId(userID: string) {
    return this.conversationModel
      .find({ participants: userID })
      .populate('participants lastMessage');

    // get user profiles for all participants & re-map
    // return this.conversationModel.aggregate([
    //   {
    //     $match: {
    //       // participants: new Types.ObjectId(userId),
    //       participants: userID,
    //     },
    //   },
    //   //   {
    //   //     $lookup: {
    //   //       from: 'users',
    //   //       localField: 'participants',
    //   //       foreignField: '_id',
    //   //       as: 'participants',
    //   //     },
    //   //   },
    // ]);
  }

  async getConversationById(conversationId: string) {
    return (
      this.conversationModel
        .findById(conversationId)
        //   .populate('participants lastMessage');
        .populate('lastMessage')
    );
  }

  async isValidConversation(conversationId: string) {
    const conversation = await this.conversationModel.findById(
      conversationId,
      // '_id',
    );

    if (!conversation) {
      throw new NotFoundException("Conversation doesn't exits!");
    }

    return conversation;
  }

  async updateConversationById(id, update) {
    this.conversationModel.findByIdAndUpdate(id, { $set: update });
  }
}
