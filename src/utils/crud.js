const getOne = (model) => async (req, res) => {
  try {
    const doc = await model
      .findOne({
        ...(req.user._id && { createdBy: req.user._id }),
        _id: req.params.id
      })
      .lean()
      .exec()

    if (!doc) {
      return res.status(400).json({ data: null, message: "Data not found" })
    }

    res.status(200).json({ data: doc, message: null })
  } catch (e) {
    console.error(e)
    res.status(500).json({ data: null, message: "Server error" })
  }
}

const getMany = (model, searchQuery) => async (req, res) => {
  try {
    const { skip, limit, search, status } = req.query
    const regex = new RegExp(search, "i")
    const docs = await model
      .find({
        ...(req.user._id && req.user.role !== "admin" && { createdBy: req.user._id }),
        ...(search && { [searchQuery]: { $regex: regex } }),
        // ...(status && {status}),
        ...((!status) ? { status: { $in: ["Active", "Pending", "Accepted", "Dispatched", "Delivered", "Cancel"] } } : (status === "All") ? '' : {status}),
      })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
    res.status(200).json({
      data: docs,
      totalCount: await model.count({
        ...(req.user._id &&
          req.user.role !== "admin" && { createdBy: req.user._id })
      }),
      message: null
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ data: null, message: "Server Error" })
  }
}

const createOne = (model) => async (req, res) => {
  const createdBy = req.user._id
  try {
    const doc = await model.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc, message: null })
  } catch (e) {
    console.error(e)
    res.status(500).json({ data: null, message: "Server Error" })
  }
}

const updateOne = (model) => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          ...(req.user._id &&
            req.user.role !== "admin" && { createdBy: req.user._id }),
          _id: req.params.id
        },
        req.body,
        { new: true }
      )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).json({ data: null, message: "Data not found" })
    }

    res.status(200).json({ data: updatedDoc, message: null })
  } catch (e) {
    console.error(e)
    res.status(500).json({ data: null, message: "Server error" })
  }
}

const removeOne = (model) => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      ...(req.user._id &&
        req.user.role !== "admin" && { createdBy: req.user._id }),
      _id: req.params.id
    })

    if (!removed) {
      return res.status(400).json({ data: null, message: "Data not found" })
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(500).json({ data: null, message: "Server error" })
  }
}

module.exports = crudControllers = (model, searchQuery) => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model, searchQuery),
  getOne: getOne(model),
  createOne: createOne(model)
})
