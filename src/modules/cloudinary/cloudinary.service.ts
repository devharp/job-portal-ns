// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { CloudinaryUploadResponse } from 'src/constants/app-cloudinary-response.interface';

interface CustomFile extends File {
    buffer: ArrayBuffer
}

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: 'duiloptvq',
            api_key: '586615437941542',
            api_secret: '5HSuzKJGHh_v4SIOQZy_c9HU8-0',
        });
    }

    async uploadImage(file$: File, name: string): Promise<CloudinaryUploadResponse> {
        const file = file$ as unknown as CustomFile;
        const buffer = Buffer.from(new Uint8Array(file.buffer));
        const absoluteFilePath = name;

        fs.writeFileSync(absoluteFilePath, buffer);
        const response = await this.uploadFile(absoluteFilePath);
        fs.unlinkSync(absoluteFilePath);

        return response;
    }

    /**
     * Function to handle file delivery settings based on user's plan.
     * If user is on a free plan and needs to deliver PDF and ZIP files,
     * they can navigate to the Security tab of Settings in the Management Console
     * and select 'Allow delivery of PDF and ZIP files'.
     * Delivery limitations are removed upon upgrading to a paid plan.
     *
     * @function handleFileDeliverySettings
     * @param {string} filePath - filepath of a file.
     * @returns { Promise<unknown> } A message indicating the action taken based on the user's plan.
     * @throws {Error} Throws an error if an unsupported plan is provided.
     */
    private uploadFile(filePath: string): Promise<CloudinaryUploadResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(filePath, { resource_type: 'raw' }, (error: unknown, result: unknown) => {
                if (error) { reject(error) }
                else { resolve(result as CloudinaryUploadResponse) }
            });
        })
    }

    async getImage(publicId: string): Promise<any> {
        return cloudinary.url(publicId);
    }

}
