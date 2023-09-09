import "./AddTextModa.css";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { RxCross2 } from "react-icons/rx";
import { useData } from "../../Context/dataContext";

const AddReviewDialogBox = ({ children, rstId }) => {
  const [formData, setFormData] = useState({
    rating: 1,
    comment: "",
    revName: "Paras",
    pp: "https://www.svgrepo.com/show/156390/avatar.svg",
  });
  const { dispatchData } = useData();

  const formDataHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    dispatchData({
      type: "INIT_ADD_REVIEW",
      payload: { id: rstId, review: formData },
    });
    setFormData((prev) => ({
      ...prev,
      rating: 1,
      content: "",
    }));
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Add Review</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Add a review here. Click save when you're done.
          </Dialog.Description>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="rating">
              Rating
            </label>
            <select
              className="Input"
              name="rating"
              onChange={(e) => formDataHandler(e)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </fieldset>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="comment">
              Comment
            </label>
            <input
              className="Input"
              name="comment"
              onChange={(e) => formDataHandler(e)}
            />
          </fieldset>
          <div
            style={{
              display: "flex",
              marginTop: 25,
              justifyContent: "flex-end",
            }}
          >
            <Dialog.Close asChild>
              <button className="Button green" onClick={handleSubmit}>
                Save review
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <RxCross2 />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddReviewDialogBox;