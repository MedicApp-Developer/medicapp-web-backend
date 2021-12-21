import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Hospital from '../../models/hospital/hospital';
import User from '../../models/user';
import makeResponse, { sendErrorResponse } from '../../functions/makeResponse';
import UserController from '../user';
import { Roles } from '../../constants/roles';
import { HospitalType } from '../../constants/hospital';
import config from '../../config/config';
import { uploadsOnlyVideo } from '../../functions/uploadS3';
import { validateHospitalRegisteration } from '../../validation/hospitalRegisteration';
import Doctor from '../../models/doctors/doctor';
import Speciality from '../../models/doctors/speciality';
import { SERVER_ERROR_CODE } from '../../constants/statusCode';

const NAMESPACE = "Hospital";

const createHospital = async (req: Request, res: Response, next: NextFunction) => {
    // uploadsOnlyVideo(req, res, async (error: any) => {
    //     if (error) {
    //       res.json({ error: error });
    //       return makeResponse(res, 400, "Error in uploading image", null, true);
    //     } else {
    //       // If File not found
    //       // console.log("Ressss => ", req.files);
    //       if (req.file === undefined) {
    //         return makeResponse(res, 400, "No File Selected", null, true);
    //       } else {
  
            const { errors, isValid } = validateHospitalRegisteration(req.body);
            // Check validation
            if (!isValid) {
                return makeResponse(res, 400, "Validation Failed", errors, true);
            }
            
            const { email, phoneNo, password, name, tradeLicenseNo, issueDate, expiryDate, location, address, state, type } = req.body;
    
            await User.find({ email }).then((result: any) => {
                if(result.length === 0){
                    // @ts-ignore
                        const newHospital = new Hospital({
                            _id: new mongoose.Types.ObjectId(),
                            type, category: null, addons: [], phoneNo,
                            email, name, tradeLicenseNo, issueDate, expiryDate, address, state,
                            location: {
                                "type": "Point",
                                "coordinates": location
                            }
                        });
                        
                        return newHospital.save()
                            .then(async (result: any) => {
                                await UserController.createUserFromEmailAndPassword(req, res, email, password, name, "", "", Roles.HOSPITAL, result._id);
                                return makeResponse(res, 201, "Hospital Created Successfully", result, false);
                                
                                // if(){
                                //     return makeResponse(res, 201, "Hospital Created Successfully", result, false);
                                // }else {
                                //     return makeResponse(res, 201, "Something went wrong while creating Hospital", result, false);
                                // };
                            })
                            .catch((err: any) => {
                                return makeResponse(res, 400, err.message, null, true);
                            });
                }else {
                    return makeResponse(res, 400, "Email already exists", null, true);
                }
            }); 
           
    //       }
    //     }
    //   });
};

const getAllHospitals = (req: Request, res: Response, next: NextFunction) => {
    Hospital.find({})
        .then((result: any) => {
            return makeResponse(res, 200, "All Hospitals", result, false);
        })
        .catch((err: any) => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSingleHospital = async (req: Request, res: Response, next: NextFunction) => {
    const doctors = await Doctor.find({hospitalId: req.params.id}).populate('hospitalId');
    
    Hospital.findById({ _id: req.params.id }).populate("services")
    .then((data: any) => {
        return makeResponse(res, 200, "Hospital", { hospital: data, doctors }, false);
    }).catch((err: any) => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const getHospitalDetail = async (req: Request, res: Response, next: NextFunction) => {    

    const { id } = req.params;

    try {
        const hospitalDetail = await Hospital.findById({ _id: id }).populate("services");
    
        const hospitalDoctors = await Doctor.find({ hospitalId: id }).populate("specialityId");
        const specialities:any = [];
    
        // @ts-ignore
        if(hospitalDoctors?.length !== 0) {
            // @ts-ignore
            hospitalDoctors?.forEach((doctor) => {
                // @ts-ignore
                specialities.push(doctor.specialityId.name); 
            })
        }
    
        // @ts-ignore
        return makeResponse(res, 200, "Hospital", { hospitalDetail, hospitalDoctors, specialities }, false);

    } catch(err) {
        // @ts-ignore
        return makeResponse(res, 400, err.message, null, true);
    }
};

const updateHospital = (req: Request, res: Response, next: NextFunction) => {
    // This _id is Hospital User ID
    const { _id } = res.locals.jwt;

    // This id is updated hospital itself id 
    const { id } = req.params;

    const update = JSON.parse(JSON.stringify({...req.body}));

    update.password && delete update.password;

    const filter = { _id: id };

    UserController.updateUser(req, res, _id, req.body);
    
    Hospital.findOneAndUpdate(filter, update).then((updatedHospital: any) => {
        return makeResponse(res, 200, "Hospital updated Successfully", updatedHospital, false);
    }).catch((err: any) => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deleteHospital = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const hospital = await Hospital.findByIdAndDelete(_id);
    if (!hospital) return res.sendStatus(404);
        await UserController.deleteUserWithEmail(hospital.email);
        return makeResponse(res, 200, "Deleted Successfully", Hospital, false);
        
        // if(){
        //     return makeResponse(res, 200, "Deleted Successfully", Hospital, false);
        // }else {
        //     return makeResponse(res, 400, "Error while deleting Hospital", null, true);
        // }
    } catch (e) {
        return res.sendStatus(400);
    }
};

const searchHospital = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params;

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i');

    const searchQuery = [
        { name: searchedTextRegex }, 
        { location: searchedTextRegex },
        { email: searchedTextRegex },
        { tradeLicenseNo: searchedTextRegex } 
    ]

    try {

        const searchedHospitalList = await Hospital.find({$or: searchQuery});

        if(searchedHospitalList.length === 0){
            const specialitySearchQuery = [
                { name: searchedTextRegex }, 
                { tags: searchedTextRegex },
            ];
            const searchSpecIds = await Speciality.find({$or: specialitySearchQuery}).select('_id')
            // @ts-ignore
            const filteredIds = searchSpecIds.map(function (obj) { return obj._id });
           
            const searchedDoctorsIds = await Doctor.find({specialityId: { $in: filteredIds}}).select('hospitalId');
            
            const filteredHospitalIds = searchedDoctorsIds.map(function (obj) { return obj.hospitalId });

            const searchResults = await Hospital.find({_id: { $in: filteredHospitalIds}})

            return makeResponse(res, 200, "Search Results", searchResults, false);
        }else {
            return makeResponse(res, 200, "Search Results", searchedHospitalList, false);
        }

    } catch(err) {
        return makeResponse(res, 400, "Error while searching hospital", null, true);
    }
};

const uploadHospitalImages = async (req: Request, res: Response, next: NextFunction) => {
    uploadsOnlyVideo(req, res, async (error: any) => {
        if (error) {
          res.json({ error: error });
          return makeResponse(res, 400, "Error in uploading image", null, true);
        } else {
          if (req.file === undefined) {
            return makeResponse(res, 400, "No File Selected", null, true);
          } else {
            const { id } = req.params;

            const filter = { _id: id };
            
            // @ts-ignore
            let update = { $push: { images: [req.file.location] } };
            
            Hospital.update(filter, update).then((updatedHospital: any) => {
                return makeResponse(res, 200, "Hospital image uploaded Successfully", updatedHospital, false);
            }).catch((err: any) => {
                return makeResponse(res, 400, err.message, null, true);
            });
          }
        }
      });
}

const filterHospital = async (req: Request, res: Response, next: NextFunction) => {
    const { checkedCategories, hospitalTypes, checkedAddons } = req.body;

    const filterQuery = {
        $and: [
            checkedCategories.length > 0 ? { 'category': { $in: checkedCategories } } : {},
            hospitalTypes.length > 0 ? { 'type': { $in: hospitalTypes } } : {},
            checkedAddons.length > 0 ? { 'services': { $in: checkedAddons } } : {}
        ]
    }

    Hospital.find(filterQuery).then(result => {
        return makeResponse(res, 200, "Filtered Hospital", result, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
}

const getHospitalDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doctors = await Doctor.find({ hospitalId: req.params.hospitalId }).populate("specialityId");
        
        return makeResponse(res, 200, "Filtered Hospital", doctors, false);
    
    } catch(err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
}

export default { 
    createHospital, 
    getAllHospitals,
    getSingleHospital,
    updateHospital,
    deleteHospital,
    searchHospital,
    uploadHospitalImages,
    filterHospital,
    getHospitalDetail,
    getHospitalDoctors
};
