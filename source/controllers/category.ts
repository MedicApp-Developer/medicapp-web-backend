import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Category from '../models/category'
import makeResponse from '../functions/makeResponse'
import UserController from '../controllers/user'
import { Roles } from '../constants/roles'

const NAMESPACE = "Category"

const createCategory = (req: Request, res: Response, next: NextFunction) => {
    const { name_en, name_ar } = req.body

    const newCategory = new Category({ name_en, name_ar })
    newCategory.save().then(result => {
        return makeResponse(res, 201, "Category Created Successfully", result, false)
    })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const getAllCategories = (req: Request, res: Response, next: NextFunction) => {
    Category.find({})
        .then(result => {
            return makeResponse(res, 200, "All Categorys", result, false)
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const getSingleCategory = (req: Request, res: Response, next: NextFunction) => {
    Category.findById({ _id: req.params.id })
        .then(data => {
            return makeResponse(res, 200, "Category", data, false)
        }).catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const updateCategory = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const filter = { _id: id }
    let update = { ...req.body }

    Category.findOneAndUpdate(filter, update).then(updatedCategory => {
        return makeResponse(res, 200, "Category updated Successfully", updatedCategory, false)
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    try {
        const category = await Category.findByIdAndDelete(_id)
        if (!category) return res.sendStatus(404)
        return makeResponse(res, 200, "Deleted Successfully", Category, false)
    } catch (e) {
        return res.sendStatus(400)
    }
}

export default {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}
