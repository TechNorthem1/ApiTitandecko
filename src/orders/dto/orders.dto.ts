import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { Schema } from "mongoose";
import { IBilling } from "src/common/interfaces/billing.interface";
import { ILineItems } from "src/common/interfaces/lineItems.interface";
import { IShipping } from "src/common/interfaces/shipping.interface";

export class OrderDTO{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly payment_method: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly total:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly shipping_total:string;


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly payment_method_title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    set_paid:boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly status:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    readonly billing: IBilling;

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    readonly shipping: IShipping;

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    readonly line_items:ILineItems[];

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    readonly shipping_lines:[];

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    coupon_lines:[];
}