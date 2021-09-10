import { Schema, Document, Model, model, Types } from 'mongoose';
import Db from '@aitheon/core-server/dist/config/db';
import { JSONSchema } from 'class-validator-jsonschema';
import { IsString, IsBoolean, IsNotEmpty, IsArray, IsEnum, IsNumber, ValidateNested, IsMongoId, IsDefined, IsOptional, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

@JSONSchema({ description: 'UserAddress' })
export class System {
    @IsString()
    name: string;
    @IsOptional()
    @Type(() => Object)
    organization: any;
    @IsOptional()
    @Type(() => Object)
    createdBy: any;
    @IsOptional()
    @Type(() => Object)
    updatedBy: any;
}
const systemSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please enter system name',
        trim: true
    },
    /*
    *  Reference to organization
    */
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    /*
    * Reference to user that created
    */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    /*
   * Reference to user that last updated it
   */
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
        timestamps: true,
        collection: 'device_manager__systems'
    });

export type ISystem = Document & System;

export const SystemSchema = Db.connection.model<ISystem>('System', systemSchema);
