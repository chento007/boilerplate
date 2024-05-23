import { HttpException, HttpStatus } from '@nestjs/common';
import { Generated } from 'typeorm';

export class BaseRespone {
  private status: boolean;
  private httpStatus: HttpStatus;
  private message: string;
  private data: any;

  constructor(message: string, data: any) {
    this.status = true;
    this.httpStatus = HttpStatus.OK;
    this.message = message;
    this.data = data;
  }

  public static createSuccess(feature: string): string {
    return `The ${feature} has been saved successfully.`;
  }

  public static deleteSuccess(feature: string): string {
    return `The ${feature} has been deleted successfully.`;
  }

  public static updateSuccess(feature: string): string {
    return `The ${feature} has been updated successfully.`;
  }

  public static logoutSuccess(): string {
    return `You has been loggout successfully.`;
  }
}
