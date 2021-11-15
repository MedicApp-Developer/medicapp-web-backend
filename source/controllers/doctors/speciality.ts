import { NextFunction, Request, Response } from 'express';
import makeResponse from '../../functions/makeResponse';
import Speciality from '../../models/doctors/speciality';
import { sendErrorResponse } from '../../functions/makeResponse';
import { PARAMETER_MISSING_CODE, RECORD_NOT_FOUND, SERVER_ERROR_CODE, UNAUTHORIZED_CODE } from '../../constants/statusCode';
import validateSpecialityInput from '../../validation/speciality';
import { uploadImage } from '../../functions/uploadS3';

const NAMESPACE = "Speciality";

const createSpeciality = (req: Request, res: Response, next: NextFunction) => {
    uploadImage(req, res, async (error: any) => {
        if (error) {
            console.log(error);
          return sendErrorResponse(res, 400, "Error in uploading image", SERVER_ERROR_CODE);
        } else {
          // If File not found
          // console.log("Ressss => ", req.files);
          if (req.file === undefined) {
            return sendErrorResponse(res, 400, "No File Selected", PARAMETER_MISSING_CODE);
          } else {
  
            const { errors, isValid } = validateSpecialityInput(req.body);
            // Check validation
            if (!isValid) {
                return makeResponse(res, 400, "Validation Failed", errors, true);
            }
            
            const { name } = req.body;

            // @ts-ignore
            const newSpeciality = new Speciality({ name, logo: req.file.location });
            newSpeciality.save().then(speciality => {
               return makeResponse(res, 201, "Speciality Created Successfully", speciality, false);
            })
            .catch(err => {
               return sendErrorResponse(res, 400, "Unable to create speciality", SERVER_ERROR_CODE);
            });  
        }
        }
      });
};

const getAllSpeciality = (req: Request, res: Response, next: NextFunction) => {
    Speciality.find({})
        .then(specialities => {
            return makeResponse(res, 200, "All Specialities", specialities, false);
        })
        .catch(err => {
            return sendErrorResponse(res, 400, "No Record Found", RECORD_NOT_FOUND);
        })
};

const getSingleSpeciality = (req: Request, res: Response, next: NextFunction) => {
    Speciality.findById({ _id: req.params.id })
    .then(data => {
        return makeResponse(res, 200, "Speciality", data, false);
    }).catch(err => {
        return sendErrorResponse(res, 400, "No Record Found", RECORD_NOT_FOUND);
    })
};

const updateSpeciality = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Speciality.findOneAndUpdate(filter, update).then(updatedSpeciality => {
        return makeResponse(res, 200, "Speciality updated Successfully", updatedSpeciality, false);
    }).catch(err => {
        return sendErrorResponse(res, 400, "Unable to update record", SERVER_ERROR_CODE);
    });
};

const deleteSpeciality = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const speciality = await Speciality.findByIdAndDelete(_id);
    if (!speciality) return res.sendStatus(404);
        return makeResponse(res, 200, "Deleted Successfully", speciality, false);
    } catch (e) {
        return sendErrorResponse(res, 400, "Unable to delete record", SERVER_ERROR_CODE);
    }
};

export default { 
    createSpeciality, 
    getAllSpeciality,
    getSingleSpeciality,
    updateSpeciality,
    deleteSpeciality
};
